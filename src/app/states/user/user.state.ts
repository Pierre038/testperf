import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from 'ngxs';
import { Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { User } from '../../models/user-eer.model';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';

export interface UserStateModel {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export const initialState: UserStateModel = {
  user: null,
  isLoading: false,
  error: null,
};

@State<UserStateModel>({
  name: 'user',
  defaults: initialState,
})
@Injectable()
export class UserState {
  constructor(private readonly userService: UserService) {}

  @Selector()
  public static getUser(state: UserStateModel): User {
    return state.user;
  }

  @Selector()
  public static getIsLoading(state: UserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  public static getError(state: UserStateModel): Error | null {
    return state.error;
  }

  @Action(UserActions.Create)
  public createUser({ dispatch, patchState }: StateContext<UserStateModel>, { user }: UserActions.Create): Observable<void> {
    patchState({ isLoading: true });
    return this.userService.create(user).pipe(
      mergeMap((response: User) => {
        return dispatch(new UserActions.CreateSuccess(response));
      }),
      catchError((error: Error) => {
        return dispatch(new UserActions.CreateFailed(error));
      }),
      tap(() => patchState({ isLoading: false })),
    );
  }

  @Action(UserActions.CreateSuccess)
  public CreateUserSuccess({ patchState }: StateContext<UserStateModel>, { user }: UserActions.CreateSuccess): void {
    patchState({ user });
  }

  @Action(UserActions.CreateFailed)
  public CreateUserFailed({ patchState }: StateContext<UserStateModel>, { error }: UserActions.CreateFailed): void {
    patchState({ error });
  }

  @Action(UserActions.Update)
  public UpdateUser({ dispatch, patchState }: StateContext<UserStateModel>, { user }: UserActions.Update): Observable<void> {
    patchState({ isLoading: true });
    return this.userService.update(user).pipe(
      mergeMap((response: User) => {
        return dispatch(new UserActions.UpdateSuccess(response));
      }),
      catchError((error: Error) => {
        return dispatch(new UserActions.UpdateFailed(error));
      }),
      tap(() => patchState({ isLoading: false })),
    );
  }

  @Action(UserActions.UpdateSuccess)
  public UpdateUserSuccess({ patchState }: StateContext<UserStateModel>, { user }: UserActions.UpdateSuccess): void {
    patchState({ user });
  }

  @Action(UserActions.UpdateFailed)
  public UpdateUserFailed({ patchState }: StateContext<UserStateModel>, { error }: UserActions.UpdateFailed): void {
    patchState({ error });
  }

  @Action(UserActions.Edit)
  public editUser({ patchState, getState }: StateContext<UserStateModel>, { user }: UserActions.Edit): void {
    const currentUser = getState().user;
    patchState({
      user: { ...currentUser, ...user },
    });
  }

  @Action(UserActions.Get)
  public getUser({ dispatch, patchState }: StateContext<UserStateModel>, { userId }: UserActions.Get): Observable<void> {
    patchState({ isLoading: true });
    return this.userService.get(userId).pipe(
      mergeMap((response: User) => {
        return dispatch(new UserActions.GetSuccess(response));
      }),
      catchError((error: Error) => {
        return dispatch(new UserActions.GetFailed(error));
      }),
      tap(() => patchState({ isLoading: false })),
    );
  }

  @Action(UserActions.GetSuccess)
  public GetUserSuccess({ patchState }: StateContext<UserStateModel>, { user }: UserActions.GetSuccess): void {
    patchState({ user });
  }

  @Action(UserActions.GetFailed)
  public GetUserFailed({ patchState }: StateContext<UserStateModel>, { error }: UserActions.GetFailed): void {
    patchState({ error });
  }
}
