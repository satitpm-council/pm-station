#!/bin/sh

# Set the search directory and search pattern based on the input parameters
search_dir=$1

echo "-------------------------------------------------------"
echo "Cleanup .next extensions"
if [ "$2" = "--keep-next" ]; then
  echo "Current Platform: Next.js"
else
  echo "Current Platform: Non Next.js"
fi
echo "-------------------------------------------------------"

# Find all files with the specified search pattern in the search directory
files=$(find "$search_dir" -type f -name "*.next.ts*")


# Loop through each file and delete it if a corresponding file exists
for next_file in $files; do
  path=$(dirname "$next_file")
  # Strip the extension from the file
  base_name=$(basename "$next_file" .tsx)
  base_name=$(basename "$base_name" .ts)
  base_name=$(basename "$base_name" .next)

  echo "🔎 Next.js File: $next_file"
  # echo "Check Pattern: $path/$base_name"

  if [ -f "$path/$base_name.tsx" ]; then
    non_next_file="$path/$base_name.tsx"
  fi

  if [ -f "$path/$base_name.ts" ]; then
    non_next_file="$path/$base_name.ts"
  fi

  if [ -n "$non_next_file" ]; then
    echo "✅️ Non Next.js file found: $non_next_file"
    if [ "$2" = "--keep-next" ]; then
        # If the current platform is Next.js
        # remove the file without .next extension
        rm "$non_next_file"
        if echo "$next_file" | grep -Eq ".*(.tsx)"
        then
          mv "$next_file" "$path/$base_name.tsx"
        else
          mv "$next_file" "$path/$base_name.ts"
        fi

    else
        rm "$next_file"
    fi
  fi
done
echo ""
