/**
 * 后端服务首页 - API 文档入口
 */

export default function HomePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#3b82f6' }}>租房平台 API 服务</h1>
      <p style={{ color: '#6b7280' }}>后端 API 服务正在运行中...</p>
      
      <h2 style={{ marginTop: '32px' }}>API 接口列表</h2>
      
      <h3>认证接口</h3>
      <ul>
        <li><code>POST /api/auth/register</code> - 用户注册</li>
        <li><code>POST /api/auth/login</code> - 用户登录</li>
        <li><code>GET /api/auth/me</code> - 获取当前用户信息</li>
      </ul>
      
      <h3>房源接口</h3>
      <ul>
        <li><code>GET /api/listings</code> - 获取已审核房源列表</li>
        <li><code>POST /api/listings</code> - 创建房源</li>
        <li><code>GET /api/listings/my</code> - 获取我的房源</li>
        <li><code>GET /api/listings/[id]</code> - 获取房源详情</li>
        <li><code>PUT /api/listings/[id]</code> - 更新房源</li>
        <li><code>DELETE /api/listings/[id]</code> - 删除房源</li>
      </ul>
      
      <h3>管理接口</h3>
      <ul>
        <li><code>GET /api/admin/listings</code> - 获取待审核房源</li>
        <li><code>PUT /api/admin/listings/[id]/approve</code> - 审核通过</li>
        <li><code>PUT /api/admin/listings/[id]/reject</code> - 审核驳回</li>
        <li><code>DELETE /api/admin/listings/[id]</code> - 删除违规房源</li>
      </ul>
      
      <p style={{ marginTop: '32px', color: '#9ca3af', fontSize: '14px' }}>
        前端应用请访问端口 8081
      </p>
    </div>
  );
}
