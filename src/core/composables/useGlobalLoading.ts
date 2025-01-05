import { ElLoading } from 'element-plus';

export default function useGlobalLoading() {
  let loadingInstance: any = null;

  const start = () => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading...',
      background: 'rgba(245, 245, 245, 0.14)',
    });
  };

  const finish = () => {
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  };

  return {
    start,
    finish
  };
}
