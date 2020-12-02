import { User } from '../../models/user-eer.model';

const Actions = {
  CREATE_USER: '[USER API] Create the user ',
  CREATE_USER_SUCCESS: '[USER API] Create the user success ',
  CREATE_USER_FAILED: '[USER API] Create the user failed ',
  UPDATE_USER: '[USER API] Update the user ',
  UPDATE_USER_SUCCESS: '[USER API] Update the user success ',
  UPDATE_USER_FAILED: '[USER API] Update the user failed',
  EDIT_USER: '[USER API] Edit the user',
  GET_USER: '[USER API] Get the user',
  GET_USER_SUCCESS: '[USER API] Get the user success',
  GET_USER_FAILED: '[USER API] Get the user failed',
};

export class Create {
  public static readonly type = Actions.CREATE_USER;
  constructor(public readonly user: Partial<User>) {}
}

export class CreateSuccess {
  public static readonly type = Actions.CREATE_USER_SUCCESS;
  constructor(public readonly user: User) {}
}

export class CreateFailed {
  public static readonly type = Actions.CREATE_USER_FAILED;
  constructor(public readonly error: Error) {}
}

export class Update {
  public static readonly type = Actions.UPDATE_USER;
  constructor(public readonly user: Partial<User>) {}
}
export class UpdateSuccess {
  public static readonly type = Actions.UPDATE_USER_SUCCESS;
  constructor(public readonly user: User) {}
}

export class UpdateFailed {
  public static readonly type = Actions.UPDATE_USER_FAILED;
  constructor(public readonly error: Error) {}
}

export class Edit {
  public static readonly type = Actions.EDIT_USER;
  constructor(public readonly user: Partial<User>) {}
}

export class Get {
  public static readonly type = Actions.GET_USER;
  constructor(public readonly userId: string) {}
}

export class GetSuccess {
  public static readonly type = Actions.GET_USER_SUCCESS;
  constructor(public readonly user: User) {}
}

export class GetFailed {
  public static readonly type = Actions.GET_USER_FAILED;
  constructor(public readonly error: Error) {}
}
