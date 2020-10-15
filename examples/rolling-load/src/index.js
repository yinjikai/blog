import React, { useEffect, useRef, useState } from 'react'
import './index.scss'
import { render } from 'react-dom'
const Demo = () => {
  const [pageData, setPageData] = useState([])
  //内部容器
  const innerEle = useRef(null)
  //外部容器，滚动区域
  const wrapEle = useRef(null)
  //加载区域可见性
  const [loadingVisibility, setLoadingVisibility] = useState(false)
  //当前页码
  const [currentPage, setCurrentPage] = useState(1)
  //请求状态
  const isFetching = useRef(false)
  //获取列表数据
  const fetchData = (page = 1) => {
    if (isFetching.current) return
    isFetching.current = true
    fetch(`http://localhost:3000?page=${page}`)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        console.log('fetchDone')
        isFetching.current = false
        setLoadingVisibility(false)
        setPageData([...pageData, ...res.data])
      })
  }
  const genColor = (index) => {
    return ['#f44336', '#ff9800', '#ffca28', '#4caf50', '#2196f3', '#673ab7'][
      index % 6
    ]
  }

  const handleScroll = () => {
    //请求中忽略滚动
    if (loadingVisibility || isFetching.current) {
      return
    }
    const currentPos = wrapEle.current.clientHeight + wrapEle.current.scrollTop
    console.log(currentPos, innerEle.current.offsetHeight)
    if (currentPos + 100 >= innerEle.current.offsetHeight) {
      console.log(currentPage + 1)
      setLoadingVisibility(true)
      setCurrentPage((pre) => pre + 1)

      console.log('快到底了')
    }
  }
  const throttle = () => {
    let canRun = true
    return () => {
      if (canRun) {
        canRun = false
        const timer = setTimeout(() => {
          handleScroll()
          clearTimeout(timer)
          canRun = true
        }, 300)
      }
    }
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])
  useEffect(() => {
    wrapEle.current.addEventListener('scroll', throttle(), false)
    return () => {
      wrapEle.current.removeEventListener('scroll', throttle())
    }
  }, [])
  return (
    <div ref={wrapEle} className="wrap">
      <div className="inner" ref={innerEle}>
        {pageData.map((item, index) => {
          return (
            <div
              className="item"
              style={{ background: genColor(index) }}
              key={index}>
              {item}
            </div>
          )
        })}
      </div>
      {loadingVisibility && (
        <div className="loading-wrap">加载中。。。。。 </div>
      )}
    </div>
  )
}

export default Demo

render(<Demo />, document.getElementById('app'))

// * 滚动区域+内容区高度+阈值 > 最后一个元素顶部坐标
// * 执行加载函数
// * 加载完成 更新最后一个节点坐标、分页数据
