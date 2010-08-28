* Use a real logger
* VRP solver 
* Persist problems and solutions
* Augment problem data structure to have a `status`. Status should support knowing if it has been distributed, if it's queued for distribution, or has been solved.
* Solution 'push' retries on failure.
* Better CouchDB missing db handling.
* CouchDB authentication.

* Rename stuff
** problem -> job
** client -> worker
** browser_client -> web_worker

* Make a diagram