# System UI

A styled React component library brings back Apple's System OS style.

## Inspiration

This project is inspired by [System UI](https://system-ui.com/), which is a
Apple-inspired vanilla CSS library.

> System.css is a CSS library for building interfaces that resemble Apple's
> System OS which ran from 1984-1991. Design-wise, not much really changed from
> System 1 to System 6; however this library is based on System 6 as it was the
> final monochrome version of MacOS.
>
> Fortunately, this library does not use any JavaScript and is compatible with
> any front-end framework of your choice. Most styles can also be overwritten to
> allow for deeper customization.

I have a deep appreciation for this retro, Apple-flavored design style and have
long harbored the idea of creating a component library in this style. However,
this idea remained on the back burner without being realized. Recently, I took
the opportunity to bring this concept to life through a project assignment from
the [Muxi team](https://muxixyz.com/).

Most of the design is based on system.css. For components not present in
system.css, I have made some basic designs. If any enthusiasts or designers have
suggestions, please feel free to raise them in the Issues section.

## Project Structure

### Structure

This project is built using React and TypeScript, with Vite as the build tool.
We use Storybook for component development and documentation. The project
structure is as follows:

```
system-ui/
├── .github/
│   └── workflows/ # CI/CD workflows
├── .storybook/ # Storybook configuration
│   ├── main.ts
│   ├── preview.ts
│   └── vitest.setup.ts
├── src/
│   ├── assets/ # Static assets
│   │   ├── fonts/
│   │   └── icon/
│   ├── components/ # React components
│   │   ├── Alert/
│   │   │   ├── Alert.scss
│   │   │   ├── Alert.stories.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   ├── Checkbox/
│   │   ├── Input/
│   │   ├── Menu/
│   │   └── Tabs/
│   ├── stories/ # Storybook generated stories
│   │   ├── Configure.mdx
│   │   └── assets/
│   ├── styles/ # Global styles
│   │   ├── _variables.scss
│   │   └── global.scss
│   ├── index.ts
│   └── vite-env.d.ts
├── eslint.config.js
├── package.json
├── tsconfig.build.json
├── tsconfig.json
├── vite.config.ts
└── vitest.workspace.ts
```

### Key technologies and libraries

- React
- TypeScript
- Vite
- Storybook
- SCSS
- ESLint & Prettier
- Vitest for testing

For detailed configuration, refer to the `package.json`, `vite.config.ts`, and
`.storybook/` directory.

## Thanks

Thanks to the [Muxi team](https://muxixyz.com/) for providing the opportunity to
trigger me to develop this project.

Thanks to [system.css](https://system-ui.com/) for providing the design
inspiration.

Also see:

[98.css](https://jdan.github.io/98.css/)

## References

https://developer.apple.com/design/human-interface-guidelines

https://sakofchit.github.io/system.css
