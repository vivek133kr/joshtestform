import React, { useEffect } from "react";

function GoogleSignIn() {
  useEffect(() => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          client_id:
            "555163836458-bgeqsghqt6i0l7k84ko9lvce5e0inv8i.apps.googleusercontent.com",
        })
        .then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(updateSignInStatus);
        });
    });
  }, []);

  const updateSignInStatus = (isSignedIn) => {
    if (isSignedIn) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const profile = authInstance.currentUser.get().getBasicProfile();
      console.log(profile.getName(), profile.getEmail());
    }
  };

  const signIn = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signIn();
  };

  return <button onClick={signIn}>Sign in with Google</button>;
}

export default GoogleSignIn;
