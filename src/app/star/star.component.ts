import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
/* SERVICES */
import { TmdbService } from '../shared/service/tmdb/tmdb.service';
/* MODEL */
import { MoviePersonModel } from '../movies/shared/movie-person.model';
import { TvCastModel } from '../movies/shared/tv-cast.model';
import { MovieCastModel } from '../movies/shared/movie-cast.model';
import { forkJoin } from 'rxjs';
import { StorageService } from '../shared/service/storage/storage.service';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit {
  person: MoviePersonModel | undefined;
  movies: MovieCastModel[]| undefined;
  tvCredits: TvCastModel[]| undefined;
  isLoadingResults: boolean| undefined;
  lang: string| null;
tv_credits: any;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this.lang = this.storageService.read('language')   ;
    const id = this.route.snapshot.paramMap.get('id');
    const getPerson = this.tmdbService.getPerson(+id!, this.lang!);
    const getPersonMovies = this.tmdbService.getPersonMovies(+id!, this.lang!);
    const getPersonTv = this.tmdbService.getPersonTv(+id!, this.lang!);

    forkJoin(getPerson, getPersonMovies, getPersonTv).subscribe(([person, movies, tvCredits]) => {
      this.isLoadingResults = false;
      this.person = person;
      this.movies = movies.cast.slice(0, 10);
      this.tvCredits = tvCredits.cast.slice(0, 10);
    });

  }

  back() {
    this.location.back();
  }
}
