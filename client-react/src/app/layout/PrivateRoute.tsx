import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';
import { HOME_PAGE_ROUTE } from '../constants/routes';
import { useStore } from '../stores/store';

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

export default function PrivateRoute({
  component: Component,
  ...rest
}: PrivateRouteProps) {
  const {
    userStore: { isLoggedIn },
  } = useStore();
  console.log(isLoggedIn);
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={HOME_PAGE_ROUTE} />
        )
      }
    />
  );
}
