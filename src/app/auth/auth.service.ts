import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // user = new Subject<User>();
  user = new BehaviorSubject<User>(null);
  apiKey = environment.apiKey;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  signup(email: string, password: string) {

    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.apiKey,
      {
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(respData => {
        // +respData.expiresIn (sinal de + para converter em number)
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.apiKey,
      {
        // tslint:disable-next-line: object-literal-shorthand
        email: email,
        // tslint:disable-next-line: object-literal-shorthand
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleError),
      tap(respData => {
        // +respData.expiresIn (sinal de + para converter em number)
        this.handleAuthentication(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.clear();
    // localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration); // 2000);
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Operation not allowed';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'Attempt blocked. Please try later';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid email and/or password.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'User disabled';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    // cria um expirationDate baseado no getTime() do javascript
    // vezes 1000 (para converter em miliseconds, pois expiresIn está em segundos)
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    // avisa que um novo usuário foi criado
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
