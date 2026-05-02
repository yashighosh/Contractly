import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleClearAndReload = () => {
    localStorage.removeItem('contractly-auth');
    localStorage.removeItem('contractly-data');
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        background: '#0B1629',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        padding: 24,
      }}>
        <div style={{
          maxWidth: 480,
          width: '100%',
          background: '#111F38',
          border: '1px solid #1E2D45',
          borderRadius: 16,
          padding: '40px 36px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: 'rgba(239,68,68,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 28,
          }}>⚠️</div>

          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#EDF0F7', margin: '0 0 8px' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 13, color: '#8896AD', lineHeight: 1.6, margin: '0 0 8px' }}>
            The app hit an unexpected error. This usually happens after an update.
          </p>
          <p style={{
            fontSize: 11, color: '#4A5A72', fontFamily: 'monospace',
            background: '#0B1629', borderRadius: 8, padding: '8px 12px',
            margin: '0 0 28px', textAlign: 'left', wordBreak: 'break-all',
            maxHeight: 80, overflow: 'hidden',
          }}>
            {this.state.error?.message}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={this.handleClearAndReload}
              style={{
                width: '100%', height: 44,
                background: '#C9A84C', color: '#0B1629',
                border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Clear data &amp; go to login
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%', height: 40,
                background: 'transparent', color: '#8896AD',
                border: '1px solid #1E2D45', borderRadius: 10,
                fontSize: 13, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Try reloading
            </button>
          </div>
        </div>
      </div>
    );
  }
}
