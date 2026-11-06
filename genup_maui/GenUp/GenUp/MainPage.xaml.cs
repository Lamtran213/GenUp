using System.Net.Http.Json;
using System.Text.Json;

namespace GenUp
{
    public partial class MainPage : ContentPage
    {
        private const string ApiBaseUrl = "https://genup-beta.vercel.app";
        private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(15) };

        private int _xp = 140;
        private int _points = 85;
        private int _streak = 3;
        private int _slideIndex = 0;
        private int _scenarioIndex = 0;
        private bool _scenarioRewardClaimed = false;

        private sealed record TopicSlide(
            string Badge,
            string Title,
            string Description,
            string Quest,
            string Reward,
            double Progress);

        private sealed record ScenarioItem(
            string Category,
            string Title,
            string Context,
            string OptionA,
            string OptionB,
            string OptionC,
            string BestOption,
            string FeedbackTitle,
            string FeedbackBody);

        private readonly TopicSlide[] _slides =
        [
            new(
                "🌱 CHỦ ĐỀ 1 · CƠ THỂ & DẬY THÌ",
                "Hiểu cơ thể tuổi dậy thì khoa học, không ngại ngùng",
                "Khám phá những thay đổi tự nhiên về thể chất và cảm xúc ở tuổi 11–15 qua bài học phân bước kèm tình huống thực tế.",
                "🎯 Nhiệm vụ: Sự thay đổi tự nhiên tuổi dậy thì",
                "+50 XP · +25 Điểm",
                0.56),
            new(
                "🛡️ CHỦ ĐỀ 2 · RANH GIỚI & ĐỒNG THUẬN",
                "Quy tắc vùng an toàn & quyền nói Không rõ ràng",
                "Nhận diện tiếp xúc an toàn – không an toàn, rèn kỹ năng từ chối dứt khoát và tìm người lớn tin cậy hỗ trợ.",
                "🎯 Nhiệm vụ: Lời đề nghị giữ bí mật ở hành lang",
                "+50 XP · +30 Điểm",
                0.72),
            new(
                "🌐 CHỦ ĐỀ 3 · AN TOÀN TRÊN MẠNG",
                "Bảo vệ hình ảnh cá nhân & chống dụ dỗ trực tuyến",
                "Không chia sẻ thông tin riêng tư hay hình ảnh nhạy cảm khi người lạ tặng quà trong game hoặc mạng xã hội.",
                "🎯 Nhiệm vụ: Tài khoản lạ tặng kim cương trong game",
                "+60 XP · +30 Điểm",
                0.40),
            new(
                "💛 CHỦ ĐỀ 4 · CẢM XÚC & TÂM LÝ",
                "Xây dựng tình bạn tôn trọng & đồng cảm học đường",
                "Lắng nghe cảm xúc bản thân, vượt qua áp lực đồng trang lứa và ứng xử văn minh khi bạn bè gặp chuyện tế nhị.",
                "🎯 Nhiệm vụ: Khi nhóm chat lớp mang chuyện tình cảm ra trêu",
                "+50 XP · +25 Điểm",
                0.85)
        ];

        private readonly ScenarioItem[] _scenarios =
        [
            new(
                "🌱 CƠ THỂ & DẬY THÌ",
                "Sự cố bất ngờ trong giờ ra chơi",
                "Trong giờ ra chơi ở trường, bạn nữ cùng bàn phát hiện vệt dâu kinh nguyệt thấm ra váy đồng phục và đang rất hoảng sợ, ngồi im tại chỗ không dám đứng dậy.",
                "A. Đưa áo khoác buộc ngang hông giúp bạn che lại và đi cùng bạn xuống phòng y tế.",
                "B. Nói to cho cả nhóm bạn xung quanh biết để hỏi xem ai có đồ vệ sinh cho mượn.",
                "C. Giả vờ không thấy vì ngại liên quan đến chuyện tế nhị.",
                "A",
                "🌟 Lựa chọn rất tinh tế và đáng tin cậy!",
                "Cách xử lý này vừa giải quyết ngay sự bối rối về trang phục, vừa giúp bạn ấy cảm thấy được tôn trọng và an toàn (+30 XP · +20 Điểm)."),
            new(
                "🌐 AN TOÀN TRÊN MẠNG",
                "Tài khoản lạ tặng kim cương trong game và xin ảnh cá nhân",
                "Một người quen qua game online hứa nạp gói kim cương lớn nếu bạn gửi ảnh chụp riêng tư trong phòng ngủ và dặn 'đừng nói cho bố mẹ biết'.",
                "A. Gửi ảnh nhưng che mặt đi để vẫn nhận được kim cương.",
                "B. Từ chối ngay, chụp màn hình làm bằng chứng, chặn tài khoản và báo cho bố mẹ/thầy cô.",
                "C. Im lặng nhưng vẫn tiếp tục nhắn tin trò chuyện mỗi tối.",
                "B",
                "🛡️ Phản xạ bảo vệ an toàn số xuất sắc!",
                "Mọi lời đề nghị đổi quà lấy hình ảnh riêng tư kèm yêu cầu giữ bí mật đều là dấu hiệu nguy hiểm cần chặn và báo ngay cho người lớn tin cậy (+30 XP · +20 Điểm).")
        ];

        public MainPage()
        {
            InitializeComponent();
            RenderSlide();
            RenderScenario();
            RefreshHud();
        }

        private void RefreshHud()
        {
            int level = Math.Max(1, (_xp / 100) + 1);
            HudLevelLabel.Text = $"Học sinh · Lv.{level}";
            HudXpLabel.Text = $"⚡ {_xp} XP";
            HudPointsLabel.Text = $"💎 {_points} Điểm";
            HudStreakLabel.Text = $"🔥 {_streak} ngày";
        }

        private void RenderSlide()
        {
            var slide = _slides[_slideIndex];
            SlideBadgeLabel.Text = slide.Badge;
            SlideCounterLabel.Text = $"Slide {_slideIndex + 1} / {_slides.Length}";
            SlideTitleLabel.Text = slide.Title;
            SlideDescLabel.Text = slide.Description;
            SlideQuestLabel.Text = slide.Quest;
            SlideRewardLabel.Text = slide.Reward;
            HeroProgressBar.Progress = slide.Progress;
        }

        private void RenderScenario()
        {
            var item = _scenarios[_scenarioIndex];
            ScenarioCategoryLabel.Text = item.Category;
            ScenarioTitleLabel.Text = item.Title;
            ScenarioContextLabel.Text = item.Context;
            ScenarioOptionABtn.Text = item.OptionA;
            ScenarioOptionBBtn.Text = item.OptionB;
            ScenarioOptionCBtn.Text = item.OptionC;
            ScenarioFeedbackBox.IsVisible = false;
            _scenarioRewardClaimed = false;
        }

        private void OnPrevSlideClicked(object? sender, EventArgs e)
        {
            _slideIndex = (_slideIndex - 1 + _slides.Length) % _slides.Length;
            RenderSlide();
        }

        private void OnNextSlideClicked(object? sender, EventArgs e)
        {
            _slideIndex = (_slideIndex + 1) % _slides.Length;
            RenderSlide();
        }

        private async void OnQuickStudyClicked(object? sender, EventArgs e)
        {
            _xp += 25;
            _points += 15;
            RefreshHud();
            HeroProgressBar.Progress = Math.Min(1.0, HeroProgressBar.Progress + 0.2);
            await DisplayAlert("Hoàn thành bước học tập! 🎉", "Bạn vừa nhận thêm +25 XP và +15 Điểm thưởng vào hồ sơ GenUp.", "Tiếp tục");
        }

        private void OnOpenScenariosTabClicked(object? sender, EventArgs e)
        {
            SwitchTab("scenarios");
        }

        private void EvaluateScenarioChoice(string chosen)
        {
            var item = _scenarios[_scenarioIndex];
            ScenarioFeedbackBox.IsVisible = true;

            if (chosen == item.BestOption)
            {
                ScenarioFeedbackBox.BackgroundColor = Color.FromArgb("#D9ECFDF5");
                ScenarioFeedbackBox.Stroke = Color.FromArgb("#6EE7B7");
                ScenarioFeedbackTitle.TextColor = Color.FromArgb("#065F46");
                ScenarioFeedbackTitle.Text = item.FeedbackTitle;
                ScenarioFeedbackBody.TextColor = Color.FromArgb("#047857");
                ScenarioFeedbackBody.Text = item.FeedbackBody;

                if (!_scenarioRewardClaimed)
                {
                    _scenarioRewardClaimed = true;
                    _xp += 30;
                    _points += 20;
                    QuestStatusCountLabel.Text = "2/3 hoàn thành";
                    RefreshHud();
                }
            }
            else
            {
                ScenarioFeedbackBox.BackgroundColor = Color.FromArgb("#D9FEF3C7");
                ScenarioFeedbackBox.Stroke = Color.FromArgb("#FCD34D");
                ScenarioFeedbackTitle.TextColor = Color.FromArgb("#92400E");
                ScenarioFeedbackTitle.Text = "💡 Hãy cân nhắc thêm về sự an toàn và tôn trọng!";
                ScenarioFeedbackBody.TextColor = Color.FromArgb("#B45309");
                ScenarioFeedbackBody.Text = $"Trong tình huống này, phương án {item.BestOption} sẽ giúp bảo vệ sự an toàn và cảm xúc tốt hơn. Bạn hãy thử chọn phương án {item.BestOption} nhé!";
            }
        }

        private void OnScenarioOptionAClicked(object? sender, EventArgs e) => EvaluateScenarioChoice("A");
        private void OnScenarioOptionBClicked(object? sender, EventArgs e) => EvaluateScenarioChoice("B");
        private void OnScenarioOptionCClicked(object? sender, EventArgs e) => EvaluateScenarioChoice("C");

        private void OnNextScenarioClicked(object? sender, EventArgs e)
        {
            _scenarioIndex = (_scenarioIndex + 1) % _scenarios.Length;
            RenderScenario();
        }

        private void OnSampleGendioPromptClicked(object? sender, EventArgs e)
        {
            GendioPromptEntry.Text = "Làm sao từ chối khi người lạ trên mạng xin ảnh cá nhân?";
        }

        private async void OnAskGendioClicked(object? sender, EventArgs e)
        {
            string question = GendioPromptEntry.Text?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(question))
            {
                question = "Làm sao giữ an toàn khi có người lạ nhắn tin xin ảnh riêng tư?";
                GendioPromptEntry.Text = question;
            }

            AskGendioBtn.IsEnabled = false;
            AskGendioBtn.Text = "Đang hỏi Gendio...";

            try
            {
                var response = await Http.PostAsJsonAsync($"{ApiBaseUrl}/api/gendio", new
                {
                    studentId = "10000000-0000-0000-0000-000000000001",
                    message = question
                });

                if (response.IsSuccessStatusCode)
                {
                    using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
                    if (doc.RootElement.TryGetProperty("reply", out var replyProp) &&
                        replyProp.TryGetProperty("text", out var textProp))
                    {
                        GendioReplyLabel.Text = textProp.GetString() ?? "Mình đã ghi nhận câu hỏi của bạn!";
                    }
                    else
                    {
                        GendioReplyLabel.Text = "Bạn có quyền từ chối mọi yêu cầu chia sẻ hình ảnh riêng tư và báo ngay cho cha mẹ hoặc thầy cô tin cậy.";
                    }
                }
                else
                {
                    GendioReplyLabel.Text = "Lời khuyên an toàn từ Gendio: Không bao giờ chia sẻ ảnh cá nhân cho người lạ trên mạng. Hãy chụp màn hình, chặn tài khoản và tâm sự với bố mẹ hoặc thầy cô.";
                }
            }
            catch
            {
                GendioReplyLabel.Text = "Lời khuyên an toàn từ Gendio (Offline): Bạn luôn có quyền nói KHÔNG với mọi lời đề nghị khiến bạn thấy bất an và tìm sự giúp đỡ từ người lớn tin cậy.";
            }
            finally
            {
                AskGendioBtn.IsEnabled = true;
                AskGendioBtn.Text = "Gửi câu hỏi tới Gendio Cloud →";
            }
        }

        private async void OnRegisterMobileFcmClicked(object? sender, EventArgs e)
        {
            SyncFcmBtn.IsEnabled = false;
            SyncFcmBtn.Text = "Đang đồng bộ FCM Mobile...";

            try
            {
                string platform = DeviceInfo.Current.Platform.ToString().ToLowerInvariant();
                string deviceToken = $"maui_{platform}_{Guid.NewGuid():N}";

                var response = await Http.PostAsJsonAsync($"{ApiBaseUrl}/api/fcm/device", new
                {
                    userId = "00000000-0000-0000-0000-000000000002",
                    fcmToken = deviceToken,
                    platform = platform == "winui" ? "web" : "android",
                    deviceName = $"{DeviceInfo.Current.Manufacturer} {DeviceInfo.Current.Model} (.NET MAUI)"
                });

                if (response.IsSuccessStatusCode)
                {
                    CloudStatusLabel.Text = $"✅ Đã đăng ký FCM Mobile ({DeviceInfo.Current.Platform}) lên Supabase!";
                }
                else
                {
                    CloudStatusLabel.Text = $"⚠️ Server phản hồi HTTP {(int)response.StatusCode} khi lưu thiết bị.";
                }
            }
            catch (Exception ex)
            {
                CloudStatusLabel.Text = $"⚠️ Không thể kết nối Cloud: {ex.Message}";
            }
            finally
            {
                SyncFcmBtn.IsEnabled = true;
                SyncFcmBtn.Text = "🔔 Đăng ký Thiết bị Mobile FCM lên Supabase";
            }
        }

        private async void OnOpenWebPortalClicked(object? sender, EventArgs e)
        {
            await Launcher.Default.OpenAsync(new Uri(ApiBaseUrl));
        }

        private void SwitchTab(string tab)
        {
            LearnTabSection.IsVisible = tab == "learn";
            ScenariosTabSection.IsVisible = tab == "scenarios";
            GendioTabSection.IsVisible = tab == "gendio";
            ProfileTabSection.IsVisible = tab == "profile";

            UpdateTabButtonStyle(NavLearnBtn, tab == "learn");
            UpdateTabButtonStyle(NavScenariosBtn, tab == "scenarios");
            UpdateTabButtonStyle(NavGendioBtn, tab == "gendio");
            UpdateTabButtonStyle(NavProfileBtn, tab == "profile");
        }

        private static void UpdateTabButtonStyle(Button btn, bool active)
        {
            btn.BackgroundColor = active ? Color.FromArgb("#059669") : Colors.Transparent;
            btn.TextColor = active ? Colors.White : Color.FromArgb("#0F172A");
        }

        private void OnTabLearnClicked(object? sender, EventArgs e) => SwitchTab("learn");
        private void OnTabScenariosClicked(object? sender, EventArgs e) => SwitchTab("scenarios");
        private void OnTabGendioClicked(object? sender, EventArgs e) => SwitchTab("gendio");
        private void OnTabProfileClicked(object? sender, EventArgs e) => SwitchTab("profile");
    }
}
