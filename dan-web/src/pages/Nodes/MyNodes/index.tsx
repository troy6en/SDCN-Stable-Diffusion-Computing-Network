import { App, Spin, Table } from 'antd'
import { Node } from 'typings/Node'
import { NodesResponseData } from 'api/nodes'
import { AxiosError } from 'axios'
import NodeStatusTag from 'components/NodeStatusTag'
import React, { useCallback, useEffect, useState } from 'react'
import * as nodesApi from 'api/nodes'
import to from 'await-to-js'
import cx from 'classnames'
import NodeActionsPanel from 'components/NodeActionsPanel'
import { LoadingOutlined } from '@ant-design/icons'

export interface MyNodesProps {
  refresh: () => void
  close: () => void
}

const MyNodes = (props: MyNodesProps) => {
  const { refresh } = props

  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const spinIcon = (
    <LoadingOutlined style={{ fontSize: 36, color: '#FFF' }} spin />
  )

  const columns = [
    {
      title: 'Node ID',
      dataIndex: 'nodeId',
    },
    {
      title: 'Worker URL',
      dataIndex: 'worker',
    },
    {
      title: 'Tasks handled',
      dataIndex: 'taskHandlerCount',
    },
    {
      title: 'Current Status',
      key: 'status',
      render: (node: Node) => <NodeStatusTag status={node.status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (node: Node) => (
        <NodeActionsPanel
          node={node}
          onLaunch={onLaunch}
          onStop={onStop}
          onRevoke={onRevoke}
        />
      ),
    },
  ]

  const PAGE_SIZE = 10
  const [nodes, setNodes] = useState<Node[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [totalSize, setTotalSize] = useState(0)

  const getMyNodesList = useCallback(
    async (page: number, size: number = PAGE_SIZE) => {
      const [_nodesError, _nodes] = await to<NodesResponseData, AxiosError>(
        nodesApi.myNodes(page, size),
      )

      if (_nodesError !== null) {
        setNodes([])
        message.error(_nodesError.message)
        console.error('getMyNodesListError', _nodesError)
        return
      }

      if (_nodes.totalSize === 0) {
        setNodes([])
      } else {
        setNodes(_nodes.items)
      }
      setPageNo(_nodes.pageNo)
      setTotalSize(_nodes.totalSize)
    },
    [message],
  )

  const onLaunch = useCallback(
    async (node: Node) => {
      setLoading(true)
      const [_nodeError] = await to<Node, AxiosError>(
        nodesApi.launchNode(node.nodeId),
      )

      setLoading(false)
      if (_nodeError !== null) {
        message.error(_nodeError.message)
        console.error('launchNodeError', _nodeError, node)
        return
      }

      message.success('launch successful')

      getMyNodesList(pageNo)
      refresh()
    },
    [getMyNodesList, pageNo, refresh],
  )

  const onStop = useCallback(
    async (node: Node) => {
      setLoading(true)
      const [_nodeError] = await to<Node, AxiosError>(
        nodesApi.stopNode(node.nodeId),
      )

      setLoading(false)
      if (_nodeError !== null) {
        message.error(_nodeError.message)
        console.error('stopNodeError', _nodeError, node)
        return
      }

      message.success('stop successful')

      getMyNodesList(pageNo)
      refresh()
    },
    [getMyNodesList, pageNo, refresh],
  )

  const onRevoke = useCallback(
    async (node: Node) => {
      setLoading(true)
      const [_nodeError] = await to<Node, AxiosError>(
        nodesApi.revokeNode(node.nodeId),
      )

      setLoading(false)
      if (_nodeError !== null) {
        message.error(_nodeError.message)
        console.error('revokeNodeError', _nodeError, node)
        return
      }

      message.success('revoke successful')

      getMyNodesList(pageNo)
      refresh()
    },
    [getMyNodesList, pageNo, refresh],
  )

  useEffect(() => {
    // Load data for page.1
    getMyNodesList(1)
  }, [getMyNodesList])

  return (
    <div className={cx('')}>
      <Table<Node>
        className={cx('overflow-x-auto')}
        columns={columns}
        dataSource={nodes}
        rowKey='nodeId'
        pagination={{
          current: pageNo,
          pageSize: PAGE_SIZE,
          total: totalSize,
          onChange: getMyNodesList,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
      />
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

export default MyNodes
