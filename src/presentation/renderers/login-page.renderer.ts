export interface LoginPageRenderer {
  // Any will be replaced by a specific type in the future
  render: (data: any) => string
}
