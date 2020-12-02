import { HttpErrorResponse } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { NgxsModule, StateContext, Store } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';
import { EMPTY, of, throwError } from 'rxjs';
import * as StateHelperMock from '../../mocks/states-helpers.mock';
import { USER_DATA } from '../../mocks/user-data.mock';
import { User } from '../../models/user-eer.model';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';
import { UserState, UserStateModel } from './user.state';

describe('UserState', () => {
  let store: Store;
  let userService: UserService;

  let state: UserState;
  let stateContextMock: StateContext<UserStateModel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserState])],
      providers: [MockProvider(UserService)],
    });

    store = TestBed.inject(Store);
    userService = TestBed.inject(UserService);
    state = TestBed.inject(UserState);

    stateContextMock = StateHelperMock.createMockStateContexte<UserStateModel>();
  }));

  test('Store should be created', () => {
    expect(store).toBeDefined();
    expect(state).toBeDefined();
  });

  describe('selectors', () => {
    describe('getUser', () => {
      test('should retrieve the user from the state ', () => {
        const expectedUser: User = USER_DATA;
        const mockedState: UserStateModel = {
          isLoading: false,
          error: null,
          user: expectedUser,
        };

        const user = UserState.getUser(mockedState);

        expect(user).toEqual(expectedUser);
      });
    });

    describe('getIsLoading', () => {
      test('should retrieve the isloading property from the state ', () => {
        const expectedLoadingStatus = false;
        const mockedState: UserStateModel = {
          isLoading: expectedLoadingStatus,
          error: null,
          user: null,
        };

        const isLoading = UserState.getIsLoading(mockedState);

        expect(isLoading).toEqual(expectedLoadingStatus);
      });
    });

    describe('getError', () => {
      test('should retrieve the error property from the state ', () => {
        const expectedError = new Error('error message');
        const mockedState: UserStateModel = {
          isLoading: false,
          error: expectedError,
          user: null,
        };

        const error = UserState.getError(mockedState);

        expect(error).toEqual(expectedError);
      });
    });
  });

  describe('actions', () => {
    describe('createUser', () => {
      test('Should dispatch the createSuccsess action', () => {
        const createdUser: User = USER_DATA;
        const userToCreate: User = USER_DATA;

        const userServiceSpy = jest.spyOn(userService, 'create').mockReturnValue(of(createdUser)).mockName('userService.create');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const createAction = new UserActions.Create(userToCreate);
        const expectedAction = new UserActions.CreateSuccess(createdUser);

        return state
          .createUser(stateContextMock, createAction)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should dispatch the createFailed action', () => {
        const userToCreate: User = USER_DATA;
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'error system when creating the user', status: 500 });

        const userServiceSpy = jest
          .spyOn(userService, 'create')
          .mockImplementation(() => throwError(error))
          .mockName('userService.create');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const createAction = new UserActions.Create(userToCreate);
        const expectedAction = new UserActions.CreateFailed(error);

        return state
          .createUser(stateContextMock, createAction)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should patch the user property on success', () => {
        const user: User = USER_DATA;
        const action = new UserActions.CreateSuccess(user);

        state.CreateUserSuccess(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ user });
      });

      test('Should patch the error property on error', () => {
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'error system when creating the user', status: 500 });
        const action = new UserActions.CreateFailed(error);

        state.CreateUserFailed(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ error });
      });
    });

    describe('updateUser', () => {
      test('Should dispatch the updateSuccsess action', () => {
        const updatedUser: User = USER_DATA;
        const userToUpdate: User = USER_DATA;

        const userServiceSpy = jest.spyOn(userService, 'update').mockReturnValue(of(updatedUser)).mockName('userService.update');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const action = new UserActions.Update(userToUpdate);
        const expectedAction = new UserActions.UpdateSuccess(updatedUser);

        return state
          .UpdateUser(stateContextMock, action)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should dispatch the updateFailed action', () => {
        const userToCreate: User = USER_DATA;
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'error system when updating the user', status: 500 });

        const userServiceSpy = jest
          .spyOn(userService, 'update')
          .mockImplementation(() => throwError(error))
          .mockName('userService.update');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const action = new UserActions.Update(userToCreate);
        const expectedAction = new UserActions.UpdateFailed(error);

        return state
          .UpdateUser(stateContextMock, action)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should patch the user property on success', () => {
        const user: User = USER_DATA;
        const action = new UserActions.UpdateSuccess(user);

        state.UpdateUserSuccess(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ user });
      });

      test('Should patch the error property on error', () => {
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'error system when updating the user', status: 500 });
        const action = new UserActions.UpdateFailed(error);

        state.UpdateUserFailed(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ error });
      });
    });

    describe('getUser', () => {
      test('Should dispatch the getSuccsess action', () => {
        const userId: string = USER_DATA.userId;
        const fetchedUser: User = USER_DATA;

        const userServiceSpy = jest.spyOn(userService, 'get').mockReturnValue(of(fetchedUser)).mockName('userService.get');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const action = new UserActions.Get(userId);
        const expectedAction = new UserActions.GetSuccess(fetchedUser);

        return state
          .getUser(stateContextMock, action)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should dispatch the getFailed action', () => {
        const userId: string = USER_DATA.userId;
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'user not found', status: 404 });

        const userServiceSpy = jest
          .spyOn(userService, 'get')
          .mockImplementation(() => throwError(error))
          .mockName('userService.get');
        const contextDispatchSpy = jest.spyOn(stateContextMock, 'dispatch').mockReturnValue(EMPTY).mockName('stateContextMock.dispatch');

        const action = new UserActions.Get(userId);
        const expectedAction = new UserActions.GetFailed(error);

        return state
          .getUser(stateContextMock, action)
          .toPromise()
          .then(() => {
            expect(userServiceSpy).toHaveBeenCalled();
            expect(contextDispatchSpy).toHaveBeenCalledWith(expectedAction);
          });
      });

      test('Should patch the user property on success', () => {
        const user: User = USER_DATA;
        const action = new UserActions.GetSuccess(user);

        state.GetUserSuccess(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ user });
      });

      test('Should patch the error property on error', () => {
        const error: HttpErrorResponse = new HttpErrorResponse({ error: 'user not found', status: 404 });
        const action = new UserActions.GetFailed(error);

        state.GetUserFailed(stateContextMock, action);

        expect(stateContextMock.patchState).toHaveBeenCalledWith({ error });
      });
    });

    describe('editUser', () => {
      test('Should retrieve the user from the store then patch the state with new values', () => {
        const user: User = USER_DATA;
        const editedUser: User = { ...USER_DATA, firstName: 'Nicolas' };
        const mockedState = { user, error: null, isLoading: false };
        const action = new UserActions.Edit(editedUser);

        const getStateSpy = jest.spyOn(stateContextMock, 'getState').mockReturnValue(mockedState).mockName('context.getState');

        state.editUser(stateContextMock, action);

        expect(getStateSpy).toHaveBeenCalled();
        expect(stateContextMock.patchState).toHaveBeenCalledWith({ user: editedUser });
      });
    });
  });
});
