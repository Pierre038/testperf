import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserMapper } from '../mappers/user.mapper';
import { UserBapi } from '../models/user-bapi.model';
import { User } from '../models/user-eer.model';

@Injectable()
export class UserService {
  private readonly userURL: string;
  constructor(
    private readonly http: HttpClient,
    private readonly mapper: UserMapper,
  ) {
  }

  public create(user: Partial<User>): Observable<User> {
    const userBapi = this.mapper.toDomainModel(user as User);
    return this.http.post<UserBapi>(this.userURL, userBapi).pipe(map((response: UserBapi) => this.mapper.toAppModel(response)));
  }

  public update(user: Partial<User>): Observable<User> {
    const userBapi = this.mapper.toDomainModel(user as User);
    return this.http.patch<UserBapi>(this.userURL, userBapi).pipe(map((response: UserBapi) => this.mapper.toAppModel(response)));
  }

  public get(id: string): Observable<User> {
    return this.http.get<UserBapi>(`${this.userURL}${id}`).pipe(map((response: UserBapi) => this.mapper.toAppModel(response)));
  }
}
