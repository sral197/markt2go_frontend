
export function setUser (state, user) {
  state.userDetails = user
  state.loading = false
  state.userExists = !!user
}
