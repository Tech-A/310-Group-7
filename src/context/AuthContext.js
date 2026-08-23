/*
 * The context object itself, deliberately alone in a .js file.
 *
 * eslint-plugin-react-refresh (an error, not a warning, in eslint.config.js)
 * rejects a .jsx file that exports both a component and a context. Keeping the
 * context here and the provider in AuthProvider.jsx satisfies it and keeps
 * Fast Refresh working. See docs/authentication.md.
 *
 * The default is null rather than {} so useAuth can tell "no provider above me"
 * apart from "a provider with nothing in it".
 */
import { createContext } from 'react'

export const AuthContext = createContext(null)
