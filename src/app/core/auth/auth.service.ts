import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    phoneNumber?: string;
    pseudo?: string;
}

@Injectable()

export class AuthService {
    user: Observable<User | null | undefined>;
    redirectUrl: string;
    uid = '';

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`Users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    oAuthLogin(name: string, callback: any) {
        // return this.afAuth.signInWithPopup(this.getProvider(name))
        //     .then(credential => {
        //         callback();
        //         this.updateUserData(credential.user);
        //     })
        //     .catch(err => callback(err));
        return null;
    }

    getProvider(name: string) {
        switch (name) {
            // case 'google': return new auth.GoogleAuthProvider();
            // case 'facebook': return new auth.FacebookAuthProvider();
            // case 'twitter': return new auth.TwitterAuthProvider();
        }
    }

    signOut() {
        this.afAuth.signOut().then(() => this.router.navigate(['/']));
    }

    readUser() {
        return this.afAuth.authState;
    }


    deleteUser(callback: any) {
        // return this.afAuth.authState.subscribe(authState => {
        //          authState.delete()
        //          .then(success => callback())
        //         .catch(error => callback(error));
        // });
        return null;
    }

    private updateUserData(user : any) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`Users/${user.uid}`);
        const data: User = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            uid: user.uid,
            pseudo: null as any
        };

        return userRef.set(data, { merge: true});
    }
}
