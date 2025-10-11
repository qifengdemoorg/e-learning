/**
 * 图片处理工具函数
 */

/**
 * 处理图片加载错误，设置默认图片
 * @param event - 图片错误事件
 * @param defaultImage - 默认图片路径，如果不指定则使用默认课程图片
 */
export const handleImageError = (event: Event, defaultImage?: string) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = defaultImage || '/images/courses/default-course.jpg'
  }
}

/**
 * 获取课程图片 URL，如果图片不存在或路径无效，返回默认图片
 * @param imagePath - 图片路径
 * @param defaultImage - 默认图片路径
 * @returns 处理后的图片路径
 */
export const getCourseImageUrl = (imagePath: string, defaultImage?: string): string => {
  // 检查路径是否为空或无效
  if (!imagePath || imagePath.trim() === '') {
    return defaultImage || '/images/courses/default-course.jpg'
  }
  
  // 如果是相对路径，确保以 / 开头
  if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
    return '/' + imagePath
  }
  
  return imagePath
}

/**
 * 预加载图片，检查图片是否能正常加载
 * @param imagePath - 图片路径
 * @returns Promise<boolean> - 图片是否能正常加载
 */
export const preloadImage = (imagePath: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = imagePath
  })
}

/**
 * 批量检查图片是否存在，返回可用的图片列表
 * @param imagePaths - 图片路径数组
 * @returns Promise<string[]> - 可用的图片路径数组
 */
export const checkImagesExist = async (imagePaths: string[]): Promise<string[]> => {
  const results = await Promise.all(
    imagePaths.map(async (path) => {
      const exists = await preloadImage(path)
      return exists ? path : null
    })
  )
  
  return results.filter((path): path is string => path !== null)
}