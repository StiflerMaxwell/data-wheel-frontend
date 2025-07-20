数据分析平台 - 前端开发执行手册 (v4.7 - 本地优先版)
文档ID: DAP-FE-SDD-v4.7
密级: 内部机密
状态: 正式发布
起始点: 你将在一个全新的空文件夹中，使用 Tremor 的 dashboard 模板开始，所有开发都在本地进行。
核心架构: Next.js 14+ (混合渲染), Tremor (UI), Supabase Auth & MCP, Vercel 部署。
第一阶段：本地项目启动与核心集成 (预计 1-2 天)
目标： 在本地搭建起一个功能性的应用框架，完成所有基础配置和认证集成。
任务 ID	✅	任务描述	详细执行步骤与代码/配置示例	验收标准
FE-1.1	☐	创建并运行 Tremor Dashboard 项目	1. 创建新目录: 在你的工作区创建一个新文件夹，例如 data-wheel-dashboard。<br>2. 进入目录: cd data-wheel-dashboard<br>3. 初始化项目: 运行 npx create-next-app@latest . -e https://github.com/tremorlabs/tremor/tree/main/apps/Next.js-dashboard-template<br>4. 安装依赖: npm install。<br>5. 本地验证: npm run dev 并在 http://localhost:3000 确认演示页面正常。	一个基于 Tremor dashboard 模板的 Next.js 项目在你本地成功创建并运行。
FE-1.2	☐	集成 Supabase Auth	1. 安装依赖: npm install @supabase/auth-helpers-nextjs @supabase/auth-ui-react @supabase/auth-ui-shared。<br>2. 配置环境变量: 在 .env.local 文件中添加 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。<br>3. 创建路由组与布局: 在 app/ 目录下创建 (auth) 和 (dashboard) 路由组，并分别为它们创建独立的 layout.tsx。<br>4. 迁移与创建页面: <br> - 将模板原有的 app/page.tsx 和 app/layout.tsx 移动到 app/(dashboard)/ 目录下。<br> - 创建一个新的登录页 app/(auth)/sign-in/page.tsx，并使用 Supabase UI 组件。<br> - 创建一个根 app/page.tsx 用于重定向到 /dashboard。<br>5. 创建回调与中间件: 创建 app/auth/callback/route.ts 和 middleware.ts 来处理登录回调和路由保护。	在本地，用户能通过 Supabase 登录，受保护的 /dashboard 路由无法在未登录时访问。整个认证流程在本地闭环且正确无误。
第二阶段：用真实数据驱动模板 (预计 2 Sprints)
目标： 在本地，将模板中的所有模拟数据，全部替换为你 Supabase 后端分析视图中的真实数据。
任务 ID	✅	任务描述	详细执行步骤与技术细节	验收标准
FE-2.1	☐	重构主页为服务器组件	1. 改造页面: 将 app/(dashboard)/page.tsx (主页) 重构为异步服务器组件。<br>2. 创建服务端数据获取逻辑: 在 lib/supabase/server.ts 中创建 Supabase 服务端客户端。在 page.tsx 中，使用 Promise.all 并行地获取所有需要的数据（来自 daily_kpi..., utm_funnel... 等视图）。	主仪表盘页面在本地通过服务端一次性获取所有数据，并将它们准备好传递给各个子组件。
FE-2.2	☐	替换所有组件的数据源	逐个组件进行替换：<br>1. KPI 卡片: 将从服务端获取的真实 KPI 数据传递给顶部的 KPI 卡片组件。<br>2. 主图表: 将格式化后的真实时间序列数据，传递给主图表组件。<br>3. 所有表格/列表: 将从服务端获取的真实渠道/页面数据，传递给对应的表格组件。<br>4. 清理: 移除所有用不到的模拟数据文件和图表组件。	在本地运行应用时，仪表盘上的每一个可见元素都展示的是来自你 Supabase 数据库的真实数据。
FE-2.3	☐	实现全局筛选器	1. 改造筛选器: 将模板中的日期范围选择器改造为一个客户端组件。<br>2. 实现 URL 状态管理: 当用户选择新的日期范围时，使用 Next.js 的 router 更新 URL 查询参数。<br>3. 服务端响应: app/(dashboard)/page.tsx 的服务器组件通过 searchParams prop 接收到新的日期范围，并将其应用到所有数据获取函数里。	在本地，用户可以通过顶部的日期范围选择器动态地筛选整个仪表盘的数据，所有卡片、图表和表格都会相应地更新。
第三阶段：集成实时 AI 分析能力 (预计 2 Sprints)
目标： 在本地，为漂亮的 Tremor 界面赋予智能分析的“灵魂”。
任务 ID	✅	任务描述	详细执行步骤与技术细节	验收标准
FE-3.1	☐	创建“上下文感知”的 AI 组件	1. 创建组件: components/ai/ContextualAiAnalyzer.tsx，使用 Tremor 的 <Button> 和 <DialogPanel> 构建交互界面。<br>2. 集成到页面: 在每一个数据卡片（如“渠道性能”）的标题旁边，都放置这个 <ContextualAiAnalyzer /> 组件，并将当前页面的筛选条件和分析类型作为 props 传递给它。	在本地，仪表盘的每个主要数据模块旁边，都有一个独立的 "✨ AI 分析" 按钮。
FE-3.2	☐	实现动态 AI 调用与流式展示	1. 在 ContextualAiAnalyzer.tsx 中:<br> a. 当用户点击按钮打开模态框时，执行 handleGenerate 函数。<br> b. 前端只发送指令: 函数将 analysisType 和 currentFilters (来自 props) 作为请求体，调用 supabase.functions.invoke('generate-insight', { ..., responseType: 'stream' })。<br> c. 流式渲染: 将返回的数据流实时渲染到模态框中，实现打字机效果。	在本地，用户点击任一 AI 按钮后，一个模态框弹出，并实时显示只针对该卡片数据和当前全局日期范围的分析结果。
FE-3.3	☐	实现洞察的“一键保存”	1. UI: 在 AI 分析结果的模态框中，添加一个 "保存此洞察" 的 Tremor <Button>。<br>2. 函数调用: 点击按钮时，调用 supabase.functions.invoke('save-insight', ...)。<br>3. UI 反馈: 使用 Toast 库显示“保存成功！”的通知，并使用 router.refresh() 刷新数据。	在本地，用户可以将任何一次满意的 AI 分析结果一键保存到数据库，并获得清晰的操作反馈。
第四阶段：最终代码审查、版本控制与部署 (预计 1 天)
目标： 将本地开发完成的、功能完备的应用，进行最终检查，并一次性推送到 GitHub 和 Vercel。
任务 ID	✅	任务描述	详细执行步骤与技术细节	验收标准
FE-4.1	☐	进行最终的代码审查与清理	1. 代码格式化: 在项目根目录运行 npx prettier --write . 来格式化所有代码。<br>2. 移除无用代码: 删除所有被注释掉的代码块、未使用的变量和 console.log 语句。<br>3. 检查环境变量: 确认 .env.local 中的所有密钥都是正确的，并在 .env.example 文件中列出所有需要的变量名（不含值）。<br>4. 最终本地测试: 彻底关闭并重启开发服务器，以一个新用户的身份（在隐身窗口中）完整地测试一遍所有核心流程。	整个项目代码干净、规范，所有核心功能在本地最终测试中表现完美。
FE-4.2	☐	初始化 Git 并首次推送到 GitHub	1. Git 初始化 (如果之前没做): 在项目根目录运行 git init。<br>2. 创建 .gitignore: 确保 node_modules, .next, .env.local, out 等文件都被忽略。<br>3. 创建 GitHub 仓库: 登录 GitHub，创建一个新的、空的仓库。<br>4. 关联并推送:<br> git remote add origin <URL><br> git add .<br> git commit -m "feat: Initial commit of the complete data analysis platform frontend"<br> git branch -M main<br> git push -u origin main	你的完整本地项目现在被安全地托管在你自己的 GitHub 远程仓库中。
FE-4.3	☐	部署到 Vercel	1. 登录 Vercel: 使用你的 GitHub 账户登录。<br>2. 导入项目: 点击 "Add New... -> Project"，选择你刚刚创建的 GitHub 仓库。<br>3. 配置项目: <br> - Vercel 会自动识别为 Next.js 项目，大部分设置无需修改。<br> - 进入 Settings -> Environment Variables，添加所有需要的 Supabase 环境变量（NEXT_PUBLIC_... 和服务器端 SUPABASE_SERVICE_ROLE_KEY）。<br>4. 触发部署: 点击 "Deploy" 按钮。	应用成功部署到 Vercel 的 URL 上。所有功能（登录、数据展示、AI 交互）与本地开发时完全一致，现在可以公开或分享访问了。
这份“本地优先”的路线图让您可以在自己的电脑上安心地完成所有开发和测试工作，直到您对最终产品感到满意为止。最后，通过一个集中的、一次性的流程，将您的成果安全地发布到全世界。