import importCwd from 'import-cwd';
import importFrom from 'import-from';

/** Try to require something either from the CWD or the regular way */
export default function tryRequire(tryPath: string, from?: string) {
  try {
    // Require from CWD
    return importCwd(tryPath);
  } catch (error) {
    // if we try to actually require npm we will import something that is the actual npm API
    // not the plugin that we want
    if (tryPath === 'npm') {
      return;
    }

    // If a plugin has any errors we want to inform the user
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }

    try {
      // Require from __dirname. Needed for npx and global installs
      return require(tryPath);
    } catch (error) {}

    if (from) {
      try {
        return importFrom(from, tryPath);
      } catch (error) {}
    }
  }
}
