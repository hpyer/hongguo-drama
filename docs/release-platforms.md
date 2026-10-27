# 三端同步发布规则

当前正式版为 **4.0**（内部 `4.0.0`，标签 `v4.0`）。4.0 已于 2026-10-27 18:07（Asia/Shanghai）正式发布；冻结源码 `c8d9acb61ea8c4b2ca8df543b94ac0d56fdd3451`；三端 16 项附件的远端 SHA256 与大小逐项匹配。双 Mac App 与 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订，只读挂载验证通过。Windows CI 40484301307 的便携媒体、安装、重装及真实 1.80 升级资料保留检查通过；EXE 未签名。远程公告及搜索故障回退、验证与边界见 [4.0 说明](release-4.0.md)。

| 4.0 平台 | 正式构建与发行 | 签名／公证与验证边界 |
|---|---|---|
| macOS arm64 | DMG／更新 ZIP 已发布 | Developer ID、公证 Accepted、装订、只读挂载及本机安装通过 |
| macOS x64 | DMG／更新 ZIP 已发布 | Developer ID、公证 Accepted、装订、只读挂载、Rosetta 4.0 启动通过；非实体 Intel 验收 |
| Windows x64 | 安装版、便携 EXE／ZIP 与更新清单已发布，CI 40484301307 通过 | EXE 未签名；CI 媒体、安装、重装、1.80 升级资料保留通过，非实体 Windows 验收 |

已有回归记录：179 项单元测试、91 项平台检查通过。x64 包在 Rosetta 下启动并显示 4.0；本机已安装签名、公证并装订的 arm64 4.0，安装期间资料不变，包内源码匹配，已确认最新邮箱复制成功及永久关闭公告正文显示。 本轮未重做真实两集下载或完整在线播放，不沿用 3.9 的真实播放与人工听音证据。Windows 媒体检查使用 CI 测试素材；未覆盖实体 Intel Mac、实体 Windows、干净 Gatekeeper、长期播放及完整应用内跨版本更新。

本分支发行目标为 **4.1**（内部 `4.1.0`，计划标签 `v4.1`），尚未正式发行，正式 latest 仍为 4.0。4.1 增加随批量下载导出文字数据，整剧联网验收和来源锁集修复后的定向测试已完成，范围与实际验证见 [4.1 说明](release-4.1.md)。三端打包、签名、公证及统一发布已获明确授权；截至本文更新，正式三端构建、Developer ID 签名、公证、安装升级、远端回执和统一发布尚未执行。

| 4.1 目标平台 | 正式构建 | 签名／公证 | 安装／运行与发布 |
|---|---|---|---|
| macOS Apple Silicon arm64 | 待验证 | Developer ID、App／DMG 公证与装订待验证 | 待验证，未发布 |
| macOS Intel x64 | 待验证 | Developer ID、App／DMG 公证与装订待验证 | 待验证，未发布；Intel 实机覆盖另记 |
| Windows x64 | 待验证，未触发本轮 CI | 当前未配置代码签名证书，不得标为已签名 | 安装版／便携版与升级资料保留待验证，未发布 |

4.1 三个 artifact 模板采用公开两段版本，包及锁文件根版本为 `4.1.0`。正式构建、Developer ID 签名、公证 Accepted、装订、Windows CI、安装升级及远端摘要回执均待完成。4.0 的根目录触达历史清单保留在 [RELEASING.md](RELEASING.md#40-根目录提交回执)。

冻结发行前已有 22 个根项最近提交说明包含 4.0 的回执。本次文档更新由主控另行提交，提交说明须含 4.0；脚本不执行 Git、CI 或发布操作。

上一正式版为 **3.9**（内部 `3.9.0`，标签 `v3.9`）。三端 16 项附件已发布；Mac 已签名、公证和装订，Windows CI 已通过。详细变化、回执及验证边界见 [3.9 说明](release-3.9.md)。

从1.1.9开始，每次项目更新统一评估并构建三端：macOS Apple Silicon arm64、macOS Intel x64、Windows x64。使用同一发行版本，分别记录构建、签名、公证、安装和运行验收。

3.9（内部 `3.9.0`）已于 2026-10-27 14:15（Asia/Shanghai）正式发布，标签 `v3.9`。冻结源码 `4a88f2ea597101a5c2e92f2ab564afee9c5167e0`；三端 16 项附件的远端 SHA256 与大小逐项匹配。双 Mac App 与 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订。Windows CI 40458538824 的便携播放、安装、重装与真实 1.80 升级资料保留通过；EXE 未签名。 本版包含 App 取流恢复、搜索补搜、双集预取与窗口模式改进；见 [3.9 说明](release-3.9.md)。

3.8（内部 `3.8.0`）已于 2026-10-26 正式发布，标签 `v3.8`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac App 与 DMG 完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `528c716a085dc4e3323ebd0aec7fb96815bc6523`；[Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40311819587) 的便携播放、安装启动、同版本重装和真实 1.80 → 3.8 升级资料保留通过。搜索在官网没有同名结果、接口 502 或短剧名被老剧名遮蔽时，从 App 近 7 天上新目录补搜。详见 [3.8 说明](release-3.8.md)。

上一正式版为 **3.7**（内部 `3.7.0`），已于 2026-10-26 正式发布，标签 `v3.7`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac App 与 DMG 完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `85920561b68e0d5cc6ef10f5e6c2c33e96659f09`；[Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40288846088) 的便携播放、安装启动、同版本重装和真实 1.80 → 3.7 升级资料保留通过。未覆盖实体 Intel Mac、实体 Windows、干净 Gatekeeper、长期大批量观看记录与完整应用内更新。详见 [3.7 说明](release-3.7.md)。

上一正式版为 **3.6**（内部 `3.6.0`），标签 `v3.6`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `887862f449b87c56a01b565c849057756266d5a5`；后续文档提交不改变标签和已发布包。源码 CI 40280104020 与 [Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40280746595) 绑定同一冻结提交；Windows 便携播放、新装、重装、1.80 升级与资料保留通过；最终签名 arm64 包下载两集 HEVC/AAC 并本地播放 15.7 秒，x64 Rosetta 包隔离启动/退出通过。未覆盖实体 Intel/Windows、干净 Gatekeeper、长期播放、完整应用内跨版本更新；音轨解码不等于人工听感确认。详见 [3.6 说明](release-3.6.md)。

上一正式版为 **3.5**（内部 `3.5.0`），标签 `v3.5`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `34bdc9eabdd81ce42c6ed6a23516b245fe44d93e`；后续文档提交不改变标签和已发布包。源码 CI 40266052588 与 [Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40266211450) 绑定同一冻结提交；Windows 便携播放、新装、重装、1.80 升级与资料保留通过；最终签名 arm64 包实际播放本地与在线分集，arm64 原生和 x64 Rosetta 包均完成隔离启动/退出。详见 [3.5 说明](release-3.5.md)。

上一正式版为 **3.4**（内部 `3.4.0`），标签 `v3.4`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证和装订，Windows EXE 未签名。冻结源码 `241ada2d604ce65dc15d3c4df3686716ece61865`；后续文档提交不改变标签和已发布包。 Windows [本轮 CI](https://github.com/jackotom/hongguo-drama/actions/runs/40207906101) 的便携播放、新装、重装、1.80 升级与资料保留通过；Mac 冻结源码的随机两集下载、播放、定位、全屏及切集已检查，最终签名包完成 arm64 原生和 x64 Rosetta 隔离启动/退出。未覆盖实体 Intel/Windows、干净 Gatekeeper、长期播放、完整应用内跨版本更新；音轨解码不等于人工听感确认。 详见 [3.4 说明](release-3.4.md)。

上一正式版为 3.3（内部 3.3.0）。三端 16 项资产已公开并核对远端 SHA256；双 Mac 应用与 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订；Windows CI 安装、重装、跨版本升级与便携媒体检查通过，EXE 未签名。 冻结源码 `1f152862ac9bc23f0a2ad2340a32ad7a62a4aaec`；后续文档提交不改变 v3.3 标签及已发布安装包、更新包和对应源码包的字节。 Windows [本轮 CI](https://github.com/jackotom/hongguo-drama/actions/runs/40156845982)。最终 arm64 已签名包隔离启动、90% 缩放复位与正常退出通过。未覆盖实体 Intel Mac、实体 Windows、启用 Gatekeeper 的干净系统、完整应用内更新流程及长期播放；没有覆盖本机正式安装。 详见 [3.3 说明](release-3.3.md)。

从 2.0 起，对外版本、标签和下载文件名只使用两段（如 2.0、2.1）；仅机器读取的 SemVer 元数据保留末尾 .0。按整数段比较，2.0 严格高于 1.80。更早正式版为 3.2（内部 3.2.0），三端 16 项附件已公开并核对远端摘要。双 Mac 应用与 DMG 已签名、公证及装订；Windows CI 新装、重装、升级与便携媒体检查通过，EXE 未签名。冻结源码 `fe110c68f9e2a1eceb059be222901d2d37926a5d`；后续文档提交不改变 v3.2 标签及已发布安装包、更新包和对应源码包的字节。 平台验收边界见 [3.2 说明](release-3.2.md)。更早正式版为 3.1；平台构建号独立递增。具体规则见 [RELEASING.md](RELEASING.md)。

Mac使用匹配架构的Electron、FFmpeg和ffprobe；Developer ID签名、App与DMG均Apple Accepted并装订票据后发布。Windows独立验证安装/启动/媒体处理，不能用Mac或Rosetta结果代替；有任何平台未完成，发布说明必须写明，不能标记全平台完成。

发行资产统一附SHA256、应用对应源码、各平台准确媒体工具对应源码与许可。公开源码不得包含运行数据、密钥、本机路径、测试profiles或备份。不要把更新自动扩大到官网或Issue评论。

从 1.80 起，Mac 同时发布各架构 DMG 和最终签名 App ZIP，以及合并的 latest-mac.yml。Windows 同时发布 NSIS 安装版、latest.yml、便携 EXE/ZIP；安装版支持应用内更新，便携版通过下载页面更新。Windows 当前未签名，必须在发行说明中保持明确。

每次更新同时统一当前版本配置、产物名称与当前说明，并核对 GitHub 根目录全部项的最近提交说明均带本轮版本号；完整流程见 [RELEASING.md](RELEASING.md)。
