import React, { useEffect } from 'react'

import { Top } from '../components/top'
import { Header } from '../components/header'
import { ThemeSwitch } from '../components/theme-switch'
import { Footer } from '../components/footer'
import { rhythm } from '../utils/typography'

import './index.scss'
import { Helmet } from 'react-helmet'

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      dataLayer.push(arguments)
    }
    gtag('js', new Date())

    gtag('config', 'G-S9W7KTCGMN')
  }, [])

  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="google-site-verification"
          content="v7w9hhjGQptOHsDO5SKm5nSo_RWZpEZAoOHA4VAlgB8"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-S9W7KTCGMN"
        ></script>
      </Helmet>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <ThemeSwitch />
        <Header title={title} location={location} rootPath={rootPath} />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  )
}
