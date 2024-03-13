git filter-branch -f --commit-filter '
        if [ "$GIT_COMMITTER_EMAIL" = "sunil.p@orotron.com" ];
        then
                GIT_COMMITTER_NAME="dev1_labsquire";
                GIT_AUTHOR_NAME="dev1_labsquire";
                GIT_COMMITTER_EMAIL="be-dev1@labsquire.com";
                GIT_AUTHOR_EMAIL="be-dev1@labsquire.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' HEAD