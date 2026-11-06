import {
  AvatarItem,
  BadgeItem,
  DailyMission,
  InAppNotification,
  LearningModule,
  ParentInboxMessage,
  ScenarioItem,
  TopicCategory,
} from "./types";

export const TOPIC_LABELS: Record<TopicCategory, string> = {
  Puberty: "Cơ thể & Dậy thì",
  Emotion: "Cảm xúc & Tâm lý",
  Boundaries: "Ranh giới & Đồng thuận",
  CyberSafety: "An toàn trên mạng",
};

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: "mod-puberty-01",
    slug: "thay-doi-co-the-tuoi-day-thi",
    title: "Hiểu về những thay đổi tự nhiên của cơ thể ở tuổi dậy thì",
    summary:
      "Nhận biết dấu hiệu phát triển thể chất ở nam và nữ từ 11–15 tuổi, cách chăm sóc vệ sinh cá nhân và giảm bớt lo lắng.",
    topicCategory: "Puberty",
    targetMinGrade: 6,
    targetMaxGrade: 8,
    estimatedMinutes: 6,
    xpReward: 50,
    status: "Published",
    coverImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format&fit=crop",
    scenarioId: "scen-puberty-01",
    steps: [
      {
        stepIndex: 0,
        title: "Dậy thì là hành trình tự nhiên của mọi người",
        content:
          "Từ 11 đến 15 tuổi, hormone trong cơ thể bắt đầu hoạt động mạnh mẽ để giúp bạn lớn lên. Mỗi bạn có một đồng hồ sinh học riêng: có bạn cao vọt lên từ lớp 6, có bạn đến lớp 8 mới bắt đầu thay đổi rõ rệt. Cả hai đều hoàn toàn bình thường.",
        keyTakeaway: "Không so sánh tốc độ thay đổi cơ thể của mình với bạn bè xung quanh.",
      },
      {
        stepIndex: 1,
        title: "Chăm sóc làn da, mùi cơ thể và giấc ngủ",
        content:
          "Tuyến mồ hôi và tuyến bã nhờn hoạt động mạnh hơn khiến bạn dễ nổi mụn hoặc có mùi cơ thể sau giờ thể dục. Rửa mặt nhẹ nhàng 2 lần/ngày, mặc áo thấm mồ hôi và ngủ đủ 8 tiếng giúp cơ thể khỏe khoắn và tự tin hơn.",
        keyTakeaway: "Vệ sinh cá nhân hàng ngày là kỹ năng tự chăm sóc cơ bản nhất.",
      },
      {
        stepIndex: 2,
        title: "Chu kỳ kinh nguyệt và mộng tinh: Dấu hiệu trưởng thành",
        content:
          "Ở nữ giới, kỳ kinh nguyệt đầu tiên báo hiệu hệ sinh sản bắt đầu hoạt động. Ở nam giới, hiện tượng xuất tinh không chủ đích khi ngủ (mộng tinh) hay vỡ giọng là hoàn toàn sinh lý, không phải bệnh lý hay điều đáng xấu hổ.",
        keyTakeaway: "Chuẩn bị sẵn đồ dùng cá nhân và hỏi bố mẹ/nhân viên y tế khi có dấu hiệu bất thường.",
      },
    ],
  },
  {
    id: "mod-boundaries-01",
    slug: "ranh-gioi-ca-nhan-va-su-dong-thuan",
    title: "Ranh giới cá nhân, sự đồng thuận và quyền nói KHÔNG",
    summary:
      "Phân biệt tiếp xúc an toàn và không an toàn, thực hành cách từ chối dứt khoát khi cảm thấy không thoải mái.",
    topicCategory: "Boundaries",
    targetMinGrade: 6,
    targetMaxGrade: 9,
    estimatedMinutes: 7,
    xpReward: 50,
    status: "Published",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&auto=format&fit=crop",
    scenarioId: "scen-boundaries-01",
    steps: [
      {
        stepIndex: 0,
        title: "Vòng tròn ranh giới cơ thể và không gian riêng",
        content:
          "Cơ thể là của chính bạn. Không ai có quyền chạm vào vùng đồ bơi hoặc ép bạn ôm hôn, chụp ảnh nhạy cảm dù người đó là người quen, bạn học hay người lớn xung quanh.",
        keyTakeaway: "Cảm giác bất an hay khó chịu của bạn luôn đáng được lắng nghe.",
      },
      {
        stepIndex: 1,
        title: "Sự đồng thuận (Consent) nghĩa là gì?",
        content:
          "Đồng thuận là sự đồng ý tự nguyện, rõ ràng và có thể rút lại bất cứ lúc nào. Im lặng vì sợ hãi hoặc bị ép buộc không phải là đồng thuận.",
        keyTakeaway: "Tôn trọng chữ KHÔNG của người khác và bảo vệ chữ KHÔNG của chính mình.",
      },
      {
        stepIndex: 2,
        title: "Quy tắc 3 bước: Nói KHÔNG - Rời đi - Kể lại",
        content:
          "Khi gặp tiếp xúc hoặc lời đề nghị làm bạn thấy kỳ lạ: (1) Nói rõ 'Mình không thích điều này', (2) Di chuyển ngay tới nơi đông người/có ánh sáng, (3) Kể ngay cho bố mẹ hoặc thầy cô đáng tin cậy.",
        keyTakeaway: "Bí mật nào làm bạn sợ hãi thì không bao giờ được giữ kín.",
      },
    ],
  },
  {
    id: "mod-cybersafety-01",
    slug: "an-toan-tren-mang-xa-hoi-va-tin-nhan-la",
    title: "Nhận diện bẫy thao túng trên mạng xã hội & Bảo vệ dữ liệu riêng tư",
    summary:
      "Cách bảo vệ hình ảnh cá nhân, nhận diện tài khoản giả mạo làm quen và xử lý khi bị đe dọa hoặc xin ảnh riêng tư.",
    topicCategory: "CyberSafety",
    targetMinGrade: 6,
    targetMaxGrade: 9,
    estimatedMinutes: 8,
    xpReward: 50,
    status: "Published",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop",
    scenarioId: "scen-cybersafety-01",
    steps: [
      {
        stepIndex: 0,
        title: "Thông tin nào tuyệt đối không công khai?",
        content:
          "Địa chỉ nhà, lịch trình đi học một mình, thẻ học sinh rõ mã số và hình ảnh nhạy cảm là những dữ liệu kẻ xấu có thể lợi dụng để theo dõi hoặc bắt nạt trực tuyến.",
        keyTakeaway: "Luôn đặt tài khoản mạng xã hội ở chế độ riêng tư và kiểm tra người theo dõi.",
      },
      {
        stepIndex: 1,
        title: "Dấu hiệu của hành vi dụ dỗ trực tuyến (Online Grooming)",
        content:
          "Kẻ xấu thường giả làm bạn đồng trang lứa, tặng vật phẩm trong game, khen ngợi quá mức rồi dần yêu cầu giữ bí mật với bố mẹ và đòi gửi ảnh riêng tư.",
        keyTakeaway: "Quà tặng ảo trên mạng không bao giờ đổi lấy sự an toàn của bạn.",
      },
    ],
  },
  {
    id: "mod-emotion-01",
    slug: "cam-xuc-rung-dong-dau-doi-va-ton-trong-ban-be",
    title: "Quản lý cảm xúc thất thường và ứng xử văn minh với rung động tuổi học trò",
    summary:
      "Gọi tên cảm xúc, giải tỏa áp lực học tập và giữ tình bạn trong sáng, tôn trọng lẫn nhau.",
    topicCategory: "Emotion",
    targetMinGrade: 7,
    targetMaxGrade: 9,
    estimatedMinutes: 5,
    xpReward: 50,
    status: "Published",
    // Ca biên S8: một bài học cố ý không có ảnh bìa để kiểm tra khung fallback
    scenarioId: "scen-emotion-01",
    steps: [
      {
        stepIndex: 0,
        title: "Tại sao tâm trạng tuổi dậy thì dễ nắng mưa thất thường?",
        content:
          "Não bộ vùng cảm xúc phát triển nhanh hơn vùng kiểm soát lý trí ở tuổi 11–15. Vì vậy bạn dễ buồn vu vơ, cáu gắt hoặc nhạy cảm với lời nhận xét của người khác.",
        keyTakeaway: "Hít thở sâu 4 nhịp trước khi phản ứng giúp bạn tránh nói lời làm tổn thương nhau.",
      },
      {
        stepIndex: 1,
        title: "Rung động đầu đời và sự tôn trọng",
        content:
          "Cảm mến một ai đó là cảm xúc tự nhiên. Tuy nhiên, trêu chọc, ghép đôi quá đà hoặc phát tán tin đồn về bạn bè là hành vi thiếu tôn trọng ranh giới cảm xúc.",
        keyTakeaway: "Quan tâm lành mạnh là cùng nhau tiến bộ và tôn trọng khoảng trời riêng.",
      },
    ],
  },
];

export const INITIAL_SCENARIOS: ScenarioItem[] = [
  {
    id: "scen-puberty-01",
    moduleId: "mod-puberty-01",
    title: "Sự cố bất ngờ trong giờ ra chơi",
    topicCategory: "Puberty",
    contextDescription:
      "Trong giờ ra chơi ở trường, bạn nữ cùng bàn phát hiện vết dâu kinh nguyệt thấm ra váy đồng phục và đang rất hoảng sợ, ngồi im tại chỗ không dám đứng dậy.",
    question: "Nếu là bạn cùng lớp lúc đó, bạn sẽ chọn cách xử lý nào?",
    xpReward: 30,
    pointReward: 20,
    safetyReminder:
      "Sự thay đổi sinh lý tuổi dậy thì hoàn toàn tự nhiên. Thái độ bình tĩnh, tế nhị và hỗ trợ nhau giúp trường học trở thành nơi an toàn.",
    options: [
      {
        id: "opt-pub-1a",
        text: "Đưa áo khoác buộc ngang hông giúp bạn che lại và đi cùng bạn xuống phòng y tế của trường.",
        isRecommended: true,
        immediateFeedback: "Lựa chọn rất tinh tế và đáng tin cậy!",
        detailedExplanation:
          "Cách xử lý này vừa giải quyết ngay sự bối rối về trang phục, vừa giúp bạn ấy cảm thấy được tôn trọng và an toàn khi có người hỗ trợ kín đáo.",
      },
      {
        id: "opt-pub-1b",
        text: "Nói to cho cả nhóm bạn xung quanh biết để hỏi xem ai có đồ dùng vệ sinh cho mượn.",
        isRecommended: false,
        immediateFeedback: "Ý tốt nhưng cách làm dễ khiến bạn ấy ngượng ngùng hơn.",
        detailedExplanation:
          "Dù bạn muốn giúp, việc gọi to giữa lớp sẽ thu hút sự chú ý không cần thiết. Hãy trao đổi nhỏ nhẹ và kín đáo.",
      },
      {
        id: "opt-pub-1c",
        text: "Giả vờ không thấy vì ngại liên quan đến chuyện tế nhị.",
        isRecommended: false,
        immediateFeedback: "Bỏ qua có thể khiến bạn cùng bàn lo lắng suốt buổi học.",
        detailedExplanation:
          "Chỉ một hành động nhỏ như cho mượn áo khoác hoặc báo cô giáo/nhân viên y tế cũng giúp bạn bè vượt qua tình huống khó xử.",
      },
    ],
  },
  {
    id: "scen-boundaries-01",
    moduleId: "mod-boundaries-01",
    title: "Lời đề nghị giữ bí mật ở hành lang vắng",
    topicCategory: "Boundaries",
    contextDescription:
      "Sau buổi học thêm, một người quen lớn tuổi hơn rủ bạn vào góc cầu thang vắng để cho xem món quà đặc biệt, đồng thời khoác vai kéo bạn sát lại và dặn: 'Đừng nói cho bố mẹ biết nhé'.",
    question: "Bạn nên phản ứng như thế nào để bảo vệ an toàn cho bản thân?",
    xpReward: 30,
    pointReward: 20,
    safetyReminder:
      "Không bao giờ đi vào nơi vắng vẻ hoặc giữ những bí mật khiến bạn cảm thấy bất an. Hãy tìm ngay người lớn tin cậy hoặc gọi Tổng đài Bảo vệ Trẻ em 111.",
    options: [
      {
        id: "opt-bnd-1a",
        text: "Lùi lại ngay, nói rõ 'Em phải ra cổng trường gặp bố mẹ đang đợi', đi nhanh về phía có bảo vệ/đông người và kể lại cho bố mẹ.",
        isRecommended: true,
        immediateFeedback: "Chính xác! Bạn đã áp dụng đúng quy tắc Nói KHÔNG - Rời đi - Kể lại.",
        detailedExplanation:
          "Viện lý do có bố mẹ đang đợi và di chuyển ngay ra khu vực đông người giúp bạn thoát khỏi không gian nguy hiểm tức thì.",
      },
      {
        id: "opt-bnd-1b",
        text: "Đi theo xem món quà là gì vì đó là người quen, nếu thấy không ổn mới chạy ra.",
        isRecommended: false,
        immediateFeedback: "Cần cân nhắc lại: Vào nơi vắng vẻ sẽ làm giảm khả năng kêu cứu.",
        detailedExplanation:
          "Khi đã ở khu vực khuất tầm nhìn, bạn sẽ khó thoát ra hơn rất nhiều. Ranh giới an toàn cần được thiết lập ngay từ lời từ chối đầu tiên.",
      },
      {
        id: "opt-bnd-1c",
        text: "Từ chối đi theo nhưng giữ im lặng không kể cho bố mẹ vì sợ người đó buồn.",
        isRecommended: false,
        immediateFeedback: "Từ chối là đúng, nhưng giữ kín chuyện này vẫn tiềm ẩn rủi ro.",
        detailedExplanation:
          "Yêu cầu 'giữ bí mật với bố mẹ' là dấu hiệu cảnh báo đỏ. Bố mẹ cần biết để bảo vệ bạn và ngăn chặn hành vi tương tự lặp lại.",
      },
    ],
  },
  {
    id: "scen-cybersafety-01",
    moduleId: "mod-cybersafety-01",
    title: "Tài khoản lạ tặng kim cương trong game và xin ảnh cá nhân",
    topicCategory: "CyberSafety",
    contextDescription:
      "Một người bạn mới quen qua game online vừa nạp tặng bạn gói vật phẩm hiếm, sau đó nhắn tin: 'Mình tặng quà rồi, bạn chụp một tấm ảnh trong phòng riêng gửi cho mình xem mặt làm kỷ niệm nhé, không gửi là mình tung tin bạn lừa đảo đấy'.",
    question: "Quyết định an toàn nhất trong tình huống này là gì?",
    xpReward: 30,
    pointReward: 20,
    safetyReminder:
      "Tuyệt đối không gửi hình ảnh riêng tư để đổi lấy quà ảo hoặc vì bị đe dọa. Hãy chụp màn hình làm bằng chứng, chặn tài khoản và báo ngay cho bố mẹ.",
    options: [
      {
        id: "opt-cyb-1a",
        text: "Không gửi bất kỳ ảnh nào, chụp màn hình tin nhắn đe dọa, chặn/báo cáo tài khoản và nói ngay với bố mẹ.",
        isRecommended: true,
        immediateFeedback: "Quyết định rất bản lĩnh và an toàn!",
        detailedExplanation:
          "Kẻ xấu thường dùng chiêu tặng quà trước rồi gây áp lực tâm lý sau. Dừng tương tác và có người lớn can thiệp ngay lập tức sẽ cắt đứt chuỗi tống tiền/đe dọa.",
      },
      {
        id: "opt-cyb-1b",
        text: "Gửi một tấm ảnh chụp trong phòng riêng cho xong chuyện để khỏi bị bóc phốt.",
        isRecommended: false,
        immediateFeedback: "Rất rủi ro! Gửi ảnh lần 1 sẽ dẫn đến những lời đe dọa đòi hỏi cao hơn.",
        detailedExplanation:
          "Khi kẻ xấu nắm được hình ảnh cá nhân của bạn, chúng sẽ tiếp tục dùng chính bức ảnh đó để ép buộc bạn làm theo các yêu cầu tiếp theo.",
      },
      {
        id: "opt-cyb-1c",
        text: "Cãi nhau tay đôi với người đó trong khung chat để tự minh oan.",
        isRecommended: false,
        immediateFeedback: "Tranh cãi trực tiếp dễ khiến bạn bị thao túng tâm lý thêm.",
        detailedExplanation:
          "Với các tài khoản có dấu hiệu đe dọa, việc đôi co chỉ làm bạn căng thẳng và có thể vô tình tiết lộ thêm thông tin cá nhân.",
      },
    ],
  },
  {
    id: "scen-emotion-01",
    moduleId: "mod-emotion-01",
    title: "Khi nhóm chat lớp mang chuyện tình cảm ra trêu chọc",
    topicCategory: "Emotion",
    contextDescription:
      "Trong nhóm chat của lớp, một số bạn chụp lén cảnh hai bạn nam nữ đang trao đổi bài rồi ghép ảnh trêu chọc khiến bạn nữ bật khóc và không muốn đi học vào ngày mai.",
    question: "Bạn sẽ làm gì để thể hiện sự tôn trọng và bảo vệ bạn học?",
    xpReward: 30,
    pointReward: 20,
    safetyReminder:
      "Mỗi lời nói và bức ảnh đăng lên nhóm chung đều để lại tác động thật đến cảm xúc của người khác.",
    options: [
      {
        id: "opt-emo-1a",
        text: "Không thả biểu tượng cười hùa theo, nhắn riêng động viên bạn nữ và đề nghị quản trị viên nhóm/giáo viên chủ nhiệm gỡ bức ảnh.",
        isRecommended: true,
        immediateFeedback: "Hành động văn minh và giàu sự đồng cảm!",
        detailedExplanation:
          "Không tiếp tay lan truyền và chủ động báo người có trách nhiệm gỡ nội dung trêu chọc giúp chấm dứt bắt nạt hội đồng nhanh chóng.",
      },
      {
        id: "opt-emo-1b",
        text: "Thả cảm xúc haha vì nghĩ chỉ là trò đùa vui vẻ của tuổi học trò.",
        isRecommended: false,
        immediateFeedback: "Trò đùa chỉ vui khi người trong cuộc cũng thấy vui.",
        detailedExplanation:
          "Mỗi lượt tương tác hùa theo vô tình tạo thành áp lực đám đông khiến người bị trêu cảm thấy cô lập.",
      },
    ],
  },
];

export const AVATAR_SHOP_ITEMS: AvatarItem[] = [
  {
    id: "hair-bob",
    name: "Tóc ngắn năng động",
    category: "hair",
    cost: 0,
    description: "Kiểu tóc gọn gàng mặc định cho những ngày đến trường.",
  },
  {
    id: "hair-spiky",
    name: "Tóc tỉa Layer cá tính",
    category: "hair",
    cost: 40,
    description: "Phong cách thể thao hiện đại, mở khóa bằng điểm thưởng học tập.",
  },
  {
    id: "hair-curly",
    name: "Tóc xoăn bồng bềnh",
    category: "hair",
    cost: 60,
    description: "Kiểu tóc uốn nhẹ tự nhiên được yêu thích nhất trong Avatar Studio.",
  },
  {
    id: "outfit-uniform",
    name: "Đồng phục học đường",
    category: "outfit",
    cost: 0,
    description: "Trang phục tiêu chuẩn của học sinh THCS GenUp.",
  },
  {
    id: "outfit-hoodie",
    name: "Áo Hoodie Xanh Lá Chắn",
    category: "outfit",
    cost: 80,
    description: "Biểu tượng của hiệp sĩ tự bảo vệ ranh giới cá nhân.",
  },
  {
    id: "outfit-jacket",
    name: "Áo khoác Denim Năng Lượng",
    category: "outfit",
    cost: 120,
    description: "Trang phục đặc biệt dành cho học sinh chăm chỉ thực hành tình huống.",
  },
  {
    id: "acc-none",
    name: "Không dùng phụ kiện",
    category: "accessory",
    cost: 0,
    description: "Giữ diện mạo nguyên bản tối giản.",
  },
  {
    id: "acc-glasses",
    name: "Kính Thông Thái",
    category: "accessory",
    cost: 50,
    description: "Tăng vẻ tri thức khi đọc các bài học khoa học.",
  },
  {
    id: "acc-cap",
    name: "Mũ Lưỡi Trai GenUp",
    category: "accessory",
    cost: 90,
    description: "Phụ kiện giới hạn cho nhà thám hiểm kiến thức.",
  },
];

export const ACHIEVEMENT_BADGES: BadgeItem[] = [
  {
    id: "badge-first-lesson",
    title: "Bước Chân Đầu Tiên",
    description: "Hoàn thành bài học có cấu trúc đầu tiên trên GenUp.",
    conditionText: "Hoàn thành >= 1 bài học",
  },
  {
    id: "badge-boundary-guardian",
    title: "Người Bảo Vệ Ranh Giới",
    description: "Đưa ra quyết định an toàn trong ít nhất 2 tình huống tương tác.",
    conditionText: "Vượt qua >= 2 tình huống",
  },
  {
    id: "badge-streak-3",
    title: "Ngọn Lửa Bền Bỉ (Streak 3 ngày)",
    description: "Duy trì chuỗi học tập liên tiếp từ 3 ngày trở lên.",
    conditionText: "Chuỗi Streak >= 3 ngày",
  },
  {
    id: "badge-xp-master",
    title: "Nhà Thông Thái Tuổi Dậy Thì",
    description: "Đạt cột mốc từ 150 XP kinh nghiệm học tập trở lên.",
    conditionText: "Tổng XP >= 150",
  },
];

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: "lesson",
    title: "Hoàn thành 1 bài học kiến thức trong ngày",
    rewardPoints: 25,
    xpReward: 20,
  },
  {
    id: "scenario",
    title: "Thực hành giải quyết 1 tình huống mô phỏng",
    rewardPoints: 20,
    xpReward: 15,
  },
  {
    id: "review",
    title: "Ôn tập lại 1 bài học đã hoàn thành trước đó",
    rewardPoints: 15,
    xpReward: 10,
  },
];

export const INITIAL_PARENT_INBOX: ParentInboxMessage[] = [
  {
    id: "msg-report-7d",
    category: "progress_report",
    periodDays: 7,
    subject: "[Báo cáo 7 ngày] Tổng hợp tiến độ học tập kỹ năng an toàn của con",
    previewText:
      "Con đã hoàn thành 1 bài học, thực hành 2 tình huống và duy trì chuỗi 3 ngày học liên tiếp.",
    bodyText:
      "Chào phụ huynh, trong 7 ngày qua hồ sơ liên kết của con đã hoàn thành chủ đề 'Cơ thể & Dậy thì' và 'Ranh giới cá nhân'. Theo nguyên tắc bảo mật quyền riêng tư (NFR-S06), GenUp chỉ gửi số liệu tổng hợp và không tiết lộ câu trả lời tình huống riêng hay nội dung trò chuyện của con.",
    conversationPrompts: [
      "Bố/mẹ thấy tuần này con tìm hiểu về ranh giới cá nhân, theo con khi nào một lời trêu đùa của bạn bè trở thành vượt quá giới hạn?",
      "Ở trường có khu vực nào hoặc tình huống nào làm con cảm thấy chưa thực sự yên tâm không?",
    ],
    isRead: false,
    isSimulated: true,
    createdAt: "2026-11-05T08:30:00.000Z",
  },
  {
    id: "msg-reminder-01",
    category: "study_reminder",
    periodDays: 7,
    subject: "Gợi ý đồng hành 15 phút mỗi tối cùng con",
    previewText:
      "Khung giờ 20:00 - 20:15 là thời điểm lý tưởng để con duy trì chuỗi Learning Streak mà không ảnh hưởng bài vở trên lớp.",
    bodyText:
      "Mô hình học 15 phút mỗi ngày giúp học sinh tiếp thu kiến thức ngắn gọn, không gây quá tải màn hình. Phụ huynh có thể khuyến khích con hoàn thành 1 tình huống nhỏ sau giờ ăn tối.",
    conversationPrompts: [
      "Tối nay con muốn tự khám phá tình huống mới trên GenUp hay muốn cùng mẹ thảo luận một chủ đề?",
    ],
    isRead: true,
    isSimulated: true,
    createdAt: "2026-11-03T14:00:00.000Z",
  },
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: "notif-01",
    type: "badge_unlocked",
    title: "Đã mở khóa huy hiệu: Bước Chân Đầu Tiên",
    body: "Chúc mừng bạn đã hoàn thành bài học đầu tiên về sự thay đổi tự nhiên tuổi dậy thì (+50 XP).",
    actionUrl: "/rewards",
    isRead: false,
    createdAt: "2026-11-06T07:15:00.000Z",
  },
  {
    id: "notif-02",
    type: "streak_milestone",
    title: "Đạt mốc chuỗi 3 ngày học liên tiếp!",
    body: "Bạn nhận được +30 Reward Points vào ví để đổi trang phục trong Avatar Studio.",
    actionUrl: "/avatar",
    isRead: false,
    createdAt: "2026-11-05T19:45:00.000Z",
  },
];

export function matchGendioResponse(
  actorRole: "student" | "parent",
  userInput: string
): { reply: string; matchedTopic: string; requiresAdultSupport: boolean } {
  const q = userInput.toLowerCase();

  // Kiểm tra dấu hiệu mất an toàn khẩn cấp (US-50 AC2)
  if (
    q.includes("đe dọa") ||
    q.includes("tống tiền") ||
    q.includes("ép gửi ảnh") ||
    q.includes("xâm hại") ||
    q.includes("chạm vào người") ||
    q.includes("sợ quá") ||
    q.includes("bắt nạt")
  ) {
    return {
      reply:
        "⚠️ Tín hiệu ưu tiên an toàn: Điều này không phải lỗi của bạn và bạn không cần phải đối mặt một mình. Hãy dừng trả lời người đó, giữ lại bằng chứng (không xóa tin nhắn) và báo ngay cho Bố Mẹ, Thầy Cô giáo hoặc gọi miễn phí tới Tổng đài Quốc gia Bảo vệ Trẻ em số 111 (hoạt động 24/7).",
      matchedTopic: "safety_alert",
      requiresAdultSupport: true,
    };
  }

  if (actorRole === "student") {
    if (q.includes("dậy thì") || q.includes("mụn") || q.includes("kinh nguyệt") || q.includes("vỡ giọng") || q.includes("mộng tinh")) {
      return {
        reply:
          "Những thay đổi như nổi mụn, mùi cơ thể, kỳ kinh nguyệt đầu tiên hay mộng tinh đều là dấu hiệu sinh lý bình thường khi cơ thể lớn lên ở tuổi 11–15. Bạn chỉ cần giữ vệ sinh sạch sẽ, ngủ đủ giấc và mở bài học 'Hiểu về những thay đổi tự nhiên của cơ thể' trong Thư viện để xem hướng dẫn chi tiết nhé!",
        matchedTopic: "puberty",
        requiresAdultSupport: false,
      };
    }
    if (q.includes("từ chối") || q.includes("ranh giới") || q.includes("ôm") || q.includes("khó chịu")) {
      return {
        reply:
          "Khi ai đó làm bạn thấy không thoải mái, bạn hoàn toàn có quyền áp dụng quy tắc 3 bước: (1) Nói rõ 'Mình không thích điều này', (2) Rời đi tới chỗ đông người, và (3) Kể lại cho người lớn đáng tin cậy.",
        matchedTopic: "boundaries",
        requiresAdultSupport: false,
      };
    }
    if (q.includes("mạng") || q.includes("ảnh") || q.includes("game") || q.includes("lạ")) {
      return {
        reply:
          "Trên không gian mạng, tuyệt đối không chia sẻ địa chỉ nhà, lịch trình cá nhân hoặc hình ảnh nhạy cảm dù người kia hứa tặng quà trong game. Bạn có thể thực hành ngay bài 'An toàn trên mạng xã hội' tại mục Tình huống nhé.",
        matchedTopic: "cybersafety",
        requiresAdultSupport: false,
      };
    }
    return {
      reply:
        "Mình là Gendio! Hiện tại mình hỗ trợ trả lời theo bộ kiến thức đã kiểm duyệt về: (1) Cơ thể & Dậy thì, (2) Ranh giới & Sự đồng thuận, (3) Cảm xúc tuổi học trò, và (4) An toàn trên mạng. Bạn hãy chọn một câu hỏi gợi ý bên dưới hoặc gõ từ khóa chủ đề cần tìm hiểu nhé!",
      matchedTopic: "fallback",
      requiresAdultSupport: false,
    };
  }

  // Trợ lý Gendio dành cho Phụ huynh
  if (q.includes("riêng tư") || q.includes("xem tin nhắn") || q.includes("đáp án")) {
    return {
      reply:
        "Theo nguyên tắc bảo mật quyền riêng tư (NFR-S06), GenUp chỉ cung cấp cho Phụ huynh báo cáo tiến độ tổng hợp (số bài hoàn thành, tỷ lệ theo chủ đề, chuỗi ngày học Streak) và tuyệt đối không hiển thị đáp án tình huống hay lịch sử trò chuyện riêng của con. Điều này giúp con cảm thấy an toàn và trung thực khi học.",
      matchedTopic: "privacy_faq",
      requiresAdultSupport: false,
    };
  }
  if (q.includes("15 phút") || q.includes("free") || q.includes("premium") || q.includes("giá")) {
    return {
      reply:
        "Gói Free cung cấp 15 phút học tương tác chủ động mỗi ngày (bộ đếm tự tạm dừng khi ẩn tab hoặc không thao tác quá 60 giây) và giữ nguyên mọi tiến độ. Gói Premium (500.000đ/năm) mở khóa thời lượng không giới hạn và báo cáo chuyên sâu chu kỳ 7/14/30 ngày.",
      matchedTopic: "pricing_faq",
      requiresAdultSupport: false,
    };
  }
  return {
    reply:
      "Chào Phụ huynh! Gendio Phụ huynh hỗ trợ giải đáp cách đọc Báo cáo tổng hợp, thiết lập tần suất nhận Email (7/14/30 ngày), cơ chế giới hạn 15 phút Free và gợi ý mở lời trò chuyện cùng con tuổi 11–15.",
    matchedTopic: "parent_faq",
    requiresAdultSupport: false,
  };
}

