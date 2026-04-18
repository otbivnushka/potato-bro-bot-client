export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',

        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',

        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',

        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',

        sidebar: 'var(--color-sidebar)',
        'sidebar-foreground': 'var(--color-sidebar-foreground)',
        'sidebar-border': 'var(--color-sidebar-border)',
        'sidebar-accent': 'var(--color-sidebar-accent)',
        'sidebar-primary': 'var(--color-sidebar-primary)',
      },
    },
  },
};
