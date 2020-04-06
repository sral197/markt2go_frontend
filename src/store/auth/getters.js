
export function getSellerID (state) {
  if (!state.loading &&
  state.userExists &&
  state.userDetails.sellerId) {
    return state.userDetails.sellerId
  } else {
    return null
  }
}
