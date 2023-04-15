import React from 'react'
import { Modal, Image, Button, Spin, ModalFuncProps } from 'antd'
import cx from 'classnames'
import logo from 'assets/images/logo.svg'
import {
  GithubOutlined,
  // GoogleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import config from 'api/config'
import uiStore from 'stores/uiStore'

const useSignInModal = () => {
  const spinIcon = (
    <LoadingOutlined style={{ fontSize: 36, color: '#FFF' }} spin />
  )

  // const signInWithGoogleHandler = () => {
  //   setLoading(true)
  //   signInWithGoogle()
  // }

  const signInWithGithubHandler = () => {
    setLoading(true)
    signInWithGithub()
  }

  let modal: {
    destroy: () => void
    update: (
      configUpdate:
        | ModalFuncProps
        | ((prevConfig: ModalFuncProps) => ModalFuncProps),
    ) => void
  } | null = null

  const setLoading = (loading: boolean) => {
    modal?.update((prevConfig) => ({
      ...prevConfig,
      content: buildContent(loading),
    }))
  }

  const buildContent = (loading: boolean) => {
    return (
      <div
        className={cx('flex flex-col justify-center')}
        style={{ height: '254px' }}
      >
        <div
          className={cx(
            uiStore.isMobile
              ? ['flex flex-col gap-8 items-center']
              : ['flex gap-8 items-center'],
          )}
        >
          <div className={cx('')}>
            <Image src={logo} width={200} preview={false} />
          </div>
          <div className={cx('')}>
            {/* <Button
              type='default'
              size='large'
              icon={<GoogleOutlined />}
              onClick={signInWithGoogleHandler}
            >
              Sign In with Google
            </Button> */}
            <Button
              type='default'
              size='large'
              icon={<GithubOutlined />}
              onClick={signInWithGithubHandler}
            >
              Sign In with Github
            </Button>
          </div>
        </div>

        {loading ? (
          <Spin
            indicator={spinIcon}
            className={cx(
              'absolute top-0 left-0 w-full h-full rounded-lg bg-black/60 flex justify-center items-center',
            )}
          />
        ) : null}
      </div>
    )
  }

  const showSignModel = () => {
    modal = Modal.info({
      title: '',
      closable: true,
      icon: null,
      okButtonProps: {
        style: {
          display: 'none',
        },
      },
      // footer: null,
      transitionName: '',
      centered: true,
      width: 'auto',
      afterClose: () => {
        modal?.destroy()
        modal = null
      },
      content: buildContent(false),
    })
  }

  const hideSignModel = () => {
    modal?.destroy()
  }

  // const signInWithGoogle = () => {
  // }

  const signInWithGithub = () => {
    const iWidth = 600
    const iHeight = 660
    const iTop = (window.screen.availHeight - 30 - iHeight) / 2
    const iLeft = (window.screen.availWidth - 10 - iWidth) / 2

    const w = window.open(
      `${config.getBaseApiUrl()}/api/user/login/github`,
      'GithubOAuth',
      `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no,scrollbars=no, resizable=no,location=no, status=no`,
    )

    const loop = setInterval(() => {
      if (w && w.closed) {
        clearInterval(loop)
        setLoading(false)
        hideSignModel()
        window.location.reload()
      }
    }, 500)
  }

  return {
    showSignModel,
    hideSignModel,
  }
}

export default useSignInModal
