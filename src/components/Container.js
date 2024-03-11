import clsx from 'clsx'
import { html } from 'htm/react'
import { forwardRef } from 'react'

const ContainerOuter = forwardRef((props, ref) => {
  const { className, children, ...otherProps } = props
  return html`
      <div ref=${ref} className=${clsx('sm:px-8', className)} ...${otherProps}>
        <div className="mx-auto w-full max-w-7xl lg:px-8">${children}</div>
      </div>
    `
})

const ContainerInner = forwardRef((props, ref) => {
  const { className, children, ...otherProps } = props
  return html`
      <div
        ref=${ref}
        className=${clsx('relative px-4 sm:px-8 lg:px-12', className)}
        ...${otherProps}
      >
        <div className="mx-auto max-w-2xl lg:max-w-5xl">${children}</div>
      </div>
    `
})

const Container = forwardRef((props, ref) => {
  const { children, ...otherProps } = props
  return html`
      <${ContainerOuter} ref=${ref} ...${otherProps}>
        <${ContainerInner}>${children}<//>
      <//>
    `
})

export { ContainerOuter, ContainerInner, Container }
