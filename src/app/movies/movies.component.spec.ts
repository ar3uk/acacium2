import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/auth/auth.service';
import { DatabaseService } from '../shared/service/database/database.service';
import { StorageService } from '../shared/service/storage/storage.service';
import { TmdbService } from '../shared/service/tmdb/tmdb.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Observable, of } from 'rxjs';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MoviesComponent } from './movies.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaginationComponent } from '../shared/component/pagination/pagination.component';

const firebaseConfig = {
  apiKey: 'foo',
  authDomain: 'bar',
  databaseURL: 'baz',
  projectId: '0',
  storageBucket: 'foo',
  messagingSenderId: 'bar'
};
const translations: any = {foo: 'bar'};
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireAuthModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        HttpClientTestingModule,
        LazyLoadImageModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {provide: TranslateLoader, useClass: FakeLoader},
        })
      ],
      declarations: [ MoviesComponent, MovieListComponent, PaginationComponent ],
      providers: [
        AuthService,
        AngularFireAuthModule,
        DatabaseService,
        StorageService,
        TmdbService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
