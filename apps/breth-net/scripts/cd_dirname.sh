set -euo pipefail

script_dirpath="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "script_dirpath: " $script_dirpath

package_path="$(dirname "${script_dirpath}")"

echo "package_path: " $package_path

cd $package_path