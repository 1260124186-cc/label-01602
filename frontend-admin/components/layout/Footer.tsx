/**
 * 页面底部组件
 */

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 大学生租房平台. 仅供学习交流使用
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>用户投稿 + 管理员审核模式</span>
            <span>·</span>
            <span>不涉及任何交易功能</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
