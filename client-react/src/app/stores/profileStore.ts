import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { FollowingPredicate } from '../common/options/followingTypes';
import { Photo, Profile } from '../models/profile';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  isLoadingProfile: boolean = false;
  isUploading: boolean = false;
  followings: Profile[] = [];
  isLoadingFollowings: boolean = false;
  isLoading: boolean = false;
  activeTab: number = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3) {
          this.loadFollowings('followers');
        } else if (activeTab === 4) {
          this.loadFollowings('following');
        } else {
          this.followings = [];
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  get isCurrentUser(): boolean {
    return store.userStore.user?.username === this.profile?.username;
  }

  loadProfile = async (username: string) => {
    this.isLoadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.isUploading = true;

    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isUploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.isLoading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.isLoading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(
            (p) => p.id !== photo.id
          );
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  updateProfile = async (profile: Partial<Profile>) => {
    this.isLoading = true;

    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName &&
          profile.displayName !== store.userStore.user?.displayName
        ) {
          store.userStore.setDisplayName(profile.displayName);
        }
        this.profile = { ...this.profile, ...(profile as Profile) };
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.isLoading = true;
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          if (following) {
            this.profile.followersCount++;
          } else {
            this.profile.followersCount--;
          }
          this.profile.following = !this.profile.following;
        }

        if (
          this.profile &&
          this.profile.username === store.userStore.user?.username
        ) {
          if (following) {
            this.profile.followersCount++;
          } else {
            this.profile.followersCount--;
          }
        }

        this.followings.forEach((profile) => {
          if (profile.username === username) {
            if (profile.following) {
              profile.followersCount--;
            } else {
              profile.followersCount++;
            }
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };

  loadFollowings = async (predicate: FollowingPredicate) => {
    this.isLoadingFollowings = true;

    try {
      const followings = await agent.Profiles.listFollowings(
        this.profile!.username,
        predicate
      );

      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isLoadingFollowings = false;
      });
    }
  };
}
