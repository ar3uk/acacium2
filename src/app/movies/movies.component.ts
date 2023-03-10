import { Component, OnInit } from '@angular/core';
import { MovieCategoryModel } from './shared/movie-category.model';
import { MovieModel } from './shared/movie.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TmdbService } from 'src/app/shared/service/tmdb/tmdb.service';
import { ActivatedRoute, Params, NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/service/storage/storage.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  request!: Observable<MovieCategoryModel>;
  dataParam!: string;
  movies!: MovieModel[];
  currentPage!: number;
  parameter!: string | number;
  pager!: { currentPage: number; totalPages: number; startPage: number; endPage: number; pages: number[]; };
  totalPages!: number;
  title!: string | number;
  loading!: boolean;
  lang!: string| null;
  adult!: string;
  navigationSubscription: Subscription;
  moviesType!: Params;

  constructor(
    public authService: AuthService,
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.reloadPagination();
      }
    });
    this.route.params.subscribe((params: Params) => {
      this.moviesType = params;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.lang = this.storageService.read('language');
    if (!this.adult) {
      this.storageService.save('adult', false);
    }
    this.currentPage = 1;
    const getCurrentPage: string = sessionStorage.getItem('acaciummovies-current-page') || "";
    getCurrentPage ? this.currentPage = Number(getCurrentPage) : this.currentPage = 1;
  }

  getMovies(currentPage: number, params: Params) {
    if (params.term) {
      this.request = this.tmdbService.getSearchMovie(
        params.term,
        currentPage,
        this.lang as any,
        this.adult
      );
      this.parameter = params.term;
    } else if (params.category) {
      this.request = this.tmdbService.getMovie(
        params.category,
        currentPage,
        this.lang as any,
        this.adult
      )!;
      this.parameter = params.category;
    } else if (params.id && params.name) {
      this.request = this.tmdbService.getGenreMovie(
        +params.id,
        currentPage,
        this.lang as any,
        this.adult
      );
      this.parameter = +params.id;
      this.dataParam = params.name;
    } else {
      // this.request = '';//'' //null;
      this.loading = false;
    }

    if (this.request) {
      this.request.subscribe(response => {
        this.parameter === 'upcoming'
          ? (this.movies = response.results.filter(val =>
            dayjs(val.release_date).isAfter(dayjs().startOf('year'))
          ))
          : (this.movies = response.results);

        this.loading = false;
        this.title = this.parameter;
        this.totalPages = response.total_pages;
        this.pager = this.tmdbService.getPager(this.totalPages, currentPage);
      }, error => {
        this.loading = false;
      });
    }
    this.loading = false;
  }

  reloadPagination() {
    const findPagination = sessionStorage.getItem('acaciummovies-current-page');
    findPagination
      ? (this.currentPage = Number(findPagination))
      : (this.currentPage = 1);
    // this.setPage(this.currentPage);
    this.getMovies(this.currentPage, this.moviesType);
  }

  swipe(currentIndex: number) {
    this.setPage(currentIndex);
  }

  setPage(page: number) {
    this.loading = true;
    if (page < 1 || page > this.pager.totalPages) {
      this.loading = false;
      return;
    }
    this.pager = this.tmdbService.getPager(this.totalPages, page);
    this.currentPage = this.pager.currentPage;
    sessionStorage.setItem('acaciummovies-current-page', this.currentPage.toString());

    this.getMovies(this.currentPage, this.moviesType);
  }

}
