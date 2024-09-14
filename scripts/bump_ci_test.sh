#!/bin/bash

# extract the dev number from the tag
extract_dev_number() {
    local tag=$1
    if [[ $tag =~ dev\.([0-9]+) ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo "0"
    fi
}

wait_for_push() {
    local commit_hash=$1
    local branch_name=$(git rev-parse --abbrev-ref HEAD)
    local remote_name=$(git remote)

    echo "Waiting for commit to be pushed..."
    while true; do
        git fetch $remote_name $branch_name
        if git branch -r --contains $commit_hash | grep -q "$remote_name/$branch_name"; then
            echo "Commit is now on the remote branch."
            break
        fi
        echo "Waiting..."
        sleep 3
    done
}

# Function to get the last commit message and update it
get_updated_commit_message() {
    local last_message=$(git log -1 --pretty=%B)
    if [[ $last_message =~ \(([0-9]+)\)$ ]]; then
        local num=${BASH_REMATCH[1]}
        local new_num=$((num + 1))
        echo "${last_message%(*)}($new_num)"
    else
        echo "$last_message (1)"
    fi
}

last_tag=$(git describe --tags --abbrev=0)
echo "Last tag: $last_tag"

dev_number=$(extract_dev_number "$last_tag")
echo "Current dev number: $dev_number"

# bump the dev number
new_dev_number=$((dev_number + 1))
echo "New dev number: $new_dev_number"

new_commit_message=$(get_updated_commit_message)
git add .
git commit -m "$new_commit_message"

commit_hash=$(git rev-parse HEAD)
git push

wait_for_push $commit_hash

# Create and push new tag
new_tag="flower/v0.1.2-dev.$new_dev_number"
git tag "$new_tag"
git push origin "$new_tag"

echo "New tag $new_tag created and pushed."
