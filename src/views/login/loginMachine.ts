import { context } from 'ant-design-vue/lib/vc-image/src/PreviewGroup';
import { assign, createMachine } from 'xstate';
import { login, getCode, checkIsLogin, verify } from '../api'


export type AuthenticationMachineContext = {
  userDetails?: UserDetails;
};

interface UserDetails {
  username: string;
}
interface Context {
}
function checkIfLoggedIn() {
  return checkIsLogin(localStorage['token'])
}
function logIn() {
  return login()
}
export type AuthenticationMachineEvent =
  | {
    type: 'REPORT_IS_LOGGED_IN';
    userDetails: UserDetails;
  }
  | {
    type: 'REPORT_IS_LOGGED_OUT';
  }
  | {
    type: 'LOG_OUT';
  }
  | {
    type: 'LOG_IN';
    userDetails: UserDetails;
  };

const authenticationMachine = createMachine<
  AuthenticationMachineContext,
  AuthenticationMachineEvent
>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFmAduglgMbIED2OAdIdoQNb45QCSAZgDKlQwRM4DEEcmAoMAbqVrC0WXAWJlK1MHQbN2nbrwRjS8-OQDaABgC6xk4lAAHUrHwLLIAB6IArACYANCACeiAIxGACxGFK6uAMyBwQAc7vExEQC+Sd7S2HhEJPqKNPSMrBxckLx8YABO5aTlFFYANiQs1QC2FOmyWQpUeaqFGiU42jjieoam5o42dg5IzojuAOwAbBT+CwCcCwlLRkuuRjHefgjr-hQLEUtB7q7+QZdGkcmpIO2Zo5R1-RAA8hh8bB+AHEAPpMAByE1mU3sOUcLgQEV2FCCG38rnWRjuSxiSwWR0QS3WMQoESC6JiRmW4QuQRSLxwpAgcEcbzk2XIk1ssM5swRAFo1gSEPyVkZxf53EtLv4YkEPOsUmkMBl2V0lCoCupijwcFzpnC+YhrsKYmdUZirtcFmb3Pcla8VR0PhQvjrePqeXqjQg8cL-FFQuKYuskf5ZWs7Q62Z0cq7vn90J6ZqAEVFhRFwijxREYjSjEiIu5o073hzPgmMFQmWBk4bU4gNsKgiGKHLXESifKFpKYiWZGWum7uInq8yKKQWCw67yGwhJfjfG4FgtSXblgGLh4PP3VbHyPGdaPCDWJ97rNyU3N54thdLXG27q4gjs8f5icWXjGXcPIKOKlU5QALJwLAyAwDO57Xk2S4IAsWZSu4-hLO+iThHSX6lmqca-r8VYAdUIGwGBMATlOkHwgEt6wXK7jnOS8RXOGlxLEsu7OuWh4jvhlSEaB4HCLOIAwleCILsKmJnO4SL7EWtJbAs9JJEAA */
    id: 'authentication',
    initial: 'checkingIfLoggedIn',
    states: {
      checkingIfLoggedIn: {
        invoke: {
          src: 'checkIfLoggedIn',
          onDone: 'loggedIn',
          onError: 'loggedOut'
        }
      },

      loggedIn: {},

      loggedOut: {
        type: "parallel",
        entry: ['clearUserDetailsFromContext'],
        on: {
          LOG_IN: {
            invoke: login
            // target: 'loggedIn',
            // actions: 'assignUserDetailsToContext',
          },
        },

        states: {
          code: {
            states: {
              off: {},
              on: {} 
            }
          },
          errorMessage: {
            states: {
              off: {},
              on: {}
            }
          },
        },

      }
    },
  },
  {
    services: {
      checkIfLoggedIn
    },
    actions: {
      navigateToAuthPage: () => {
        // When the user is logged out, we
        // should take them to the /auth route
      },
      assignUserDetailsToContext: assign((context, event) => {
        if (event.type !== 'REPORT_IS_LOGGED_IN') {
          return {};
        }
        return {
          userDetails: event.userDetails,
        };
      }),
      clearUserDetailsFromContext: assign({
        userDetails: undefined,
      }),
    },
  },
);



export default authenticationMachine;
