import { Fragment, useState } from 'react'
import { NavBar } from '../src/presentation/home_page/components/navbar'
import '../styles/globals.css'
import '../styles/index.css'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StoreProvider } from '@src/data/providers/app_store_provider'
import { Modal } from '@src/presentation/components/modal'

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <StoreProvider {...pageProps}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link href="https://use.fontawesome.com/releases/v6.4.2/css/all.css" rel="stylesheet" />
        <title>HoYoverse Calculator</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col w-screen h-screen overflow-x-hidden">
          <NavBar />
          <Modal />
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </StoreProvider>
  )
}

export default MyApp
