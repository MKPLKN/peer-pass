const arch = process.env.ELECTRON_ARCH || 'x64' // Default to arm64 if not specified

module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    // ARM64 (Apple Silicon) macOS Build
    {
      name: '@electron-forge/maker-dmg',
      config: { arch },
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-zip',
      config: { arch },
      platforms: ['darwin']
    },

    // Existing configurations for Windows and Linux
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
      platforms: ['win32']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
      platforms: ['linux']
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
      platforms: ['linux']
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs'
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs'
          }
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs'
          }
        ]
      }
    }
  ]
}
