# 三端同步发布规则

当前正式版为 **3.6**（内部 `3.6.0`，标签 `v3.6`）。Mac arm64、Mac x64、Windows x64 共用本轮版本；构建、签名、公证、安装和运行验收分别记录，不从上一版结果推定本版通过。见 [3.6 说明](release-3.6.md)。

从1.1.9开始，每次项目更新统一评估并构建三端：macOS Apple Silicon arm64、macOS Intel x64、Windows x64。使用同一发行版本，分别记录构建、签名、公证、安装和运行验收。

3.6（内部 `3.6.0`）已于 2026-10-26 正式发布，标签 `v3.6`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `887862f449b87c56a01b565c849057756266d5a5`；后续文档提交不改变标签和已发布包。源码 CI 40280104020 与 [Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40280746595) 绑定同一冻结提交；Windows 便携播放、新装、重装、1.80 升级与资料保留通过；最终签名 arm64 包下载两集 HEVC/AAC 并本地播放 15.7 秒，x64 Rosetta 包隔离启动/退出通过。未覆盖实体 Intel/Windows、干净 Gatekeeper、长期播放、完整应用内跨版本更新；音轨解码不等于人工听感确认。详见 [3.6 说明](release-3.6.md)。

上一正式版为 **3.5**（内部 `3.5.0`），标签 `v3.5`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订，Windows EXE 未签名。冻结源码 `34bdc9eabdd81ce42c6ed6a23516b245fe44d93e`；后续文档提交不改变标签和已发布包。源码 CI 40266052588 与 [Windows CI](https://github.com/jackotom/hongguo-drama/actions/runs/40266211450) 绑定同一冻结提交；Windows 便携播放、新装、重装、1.80 升级与资料保留通过；最终签名 arm64 包实际播放本地与在线分集，arm64 原生和 x64 Rosetta 包均完成隔离启动/退出。详见 [3.5 说明](release-3.5.md)。

上一正式版为 **3.4**（内部 `3.4.0`），标签 `v3.4`。三端 16 项附件的 GitHub SHA256 与大小已核对；双 Mac 应用及 DMG 已完成 Developer ID 签名、Apple 公证和装订，Windows EXE 未签名。冻结源码 `241ada2d604ce65dc15d3c4df3686716ece61865`；后续文档提交不改变标签和已发布包。 Windows [本轮 CI](https://github.com/jackotom/hongguo-drama/actions/runs/40207906101) 的便携播放、新装、重装、1.80 升级与资料保留通过；Mac 冻结源码的随机两集下载、播放、定位、全屏及切集已检查，最终签名包完成 arm64 原生和 x64 Rosetta 隔离启动/退出。未覆盖实体 Intel/Windows、干净 Gatekeeper、长期播放、完整应用内跨版本更新；音轨解码不等于人工听感确认。 详见 [3.4 说明](release-3.4.md)。

上一正式版为 3.3（内部 3.3.0）。三端 16 项资产已公开并核对远端 SHA256；双 Mac 应用与 DMG 已完成 Developer ID 签名、Apple 公证 Accepted 和装订；Windows CI 安装、重装、跨版本升级与便携媒体检查通过，EXE 未签名。 冻结源码 `1f152862ac9bc23f0a2ad2340a32ad7a62a4aaec`；后续文档提交不改变 v3.3 标签及已发布安装包、更新包和对应源码包的字节。 Windows [本轮 CI](https://github.com/jackotom/hongguo-drama/actions/runs/40156845982)。最终 arm64 已签名包隔离启动、90% 缩放复位与正常退出通过。未覆盖实体 Intel Mac、实体 Windows、启用 Gatekeeper 的干净系统、完整应用内更新流程及长期播放；没有覆盖本机正式安装。 详见 [3.3 说明](release-3.3.md)。

从 2.0 起，对外版本、标签和下载文件名只使用两段（如 2.0、2.1）；仅机器读取的 SemVer 元数据保留末尾 .0。按整数段比较，2.0 严格高于 1.80。更早正式版为 3.2（内部 3.2.0），三端 16 项附件已公开并核对远端摘要。双 Mac 应用与 DMG 已签名、公证及装订；Windows CI 新装、重装、升级与便携媒体检查通过，EXE 未签名。冻结源码 `fe110c68f9e2a1eceb059be222901d2d37926a5d`；后续文档提交不改变 v3.2 标签及已发布安装包、更新包和对应源码包的字节。 平台验收边界见 [3.2 说明](release-3.2.md)。更早正式版为 3.1；平台构建号独立递增。具体规则见 [RELEASING.md](RELEASING.md)。

Mac使用匹配架构的Electron、FFmpeg和ffprobe；Developer ID签名、App与DMG均Apple Accepted并装订票据后发布。Windows独立验证安装/启动/媒体处理，不能用Mac或Rosetta结果代替；有任何平台未完成，发布说明必须写明，不能标记全平台完成。

发行资产统一附SHA256、应用对应源码、各平台准确媒体工具对应源码与许可。公开源码不得包含运行数据、密钥、本机路径、测试profiles或备份。不要把更新自动扩大到官网或Issue评论。

从 1.80 起，Mac 同时发布各架构 DMG 和最终签名 App ZIP，以及合并的 latest-mac.yml。Windows 同时发布 NSIS 安装版、latest.yml、便携 EXE/ZIP；安装版支持应用内更新，便携版通过下载页面更新。Windows 当前未签名，必须在发行说明中保持明确。

每次更新同时统一当前版本配置、产物名称与当前说明，并核对 GitHub 根目录全部项的最近提交说明均带本轮版本号；完整流程见 [RELEASING.md](RELEASING.md)。
