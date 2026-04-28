import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-wrap">
          <section className="glass-card space-y-3 border-rose-300/40 p-6 md:p-8">
            <h1 className="text-3xl font-semibold text-rose-100">Unexpected error</h1>
            <p className="text-rose-200">
              Something went wrong while rendering this page.
            </p>
            <button type="button" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}
