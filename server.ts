import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Google GenAI initialization with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Safely call Gemini with fallback
async function generateGeminiContent(prompt: string, systemInstruction: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('API_KEY_NOT_CONFIGURED');
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  });
  return response.text;
}

// 1. API: Generate Complete Interactive Educational App
app.post('/api/gemini/generate-app', async (req, res) => {
  try {
    const { subject, topic, gradeLevel, appType, extraRequirements } = req.body;

    const systemInstruction = `Bạn là chuyên gia sư phạm đổi mới sáng tạo EdTech hàng đầu Việt Nam. 
Nhiệm vụ của bạn là thiết kế dữ liệu kịch bản tương tác hoàn chỉnh cho ứng dụng lớp học số học sinh, định dạng JSON chuẩn. 
Các môn học theo chương trình GDPT 2018. Ngôn ngữ: Tiếng Việt, câu từ truyền cảm hứng, tính sư phạm cao, gắn liền thực tế đời sống.`;

    const prompt = `Hãy tạo một ứng dụng tương tác giáo dục liên kết cho:
- Môn học: ${subject || 'Khoa học Tự nhiên'}
- Khối lớp: ${gradeLevel || 'Lớp 8'}
- Chủ đề/Bài học: ${topic || 'Các nguồn năng lượng tái tạo'}
- Loại ứng dụng: ${appType || 'quiz'} (Các loại: quiz, spinner, timer, flashcard, exit_ticket, rubric)
- Yêu cầu thêm: ${extraRequirements || 'Thú vị, kích thích tư duy phản biện'}

Hãy trả về định dạng JSON chính xác:
{
  "title": "Tiêu đề ứng dụng hấp dẫn",
  "description": "Mô tả mục đích sư phạm và cách áp dụng trong tiết dạy (1-2 câu)",
  "subject": "${subject}",
  "gradeLevel": "${gradeLevel}",
  "type": "${appType}",
  "pedagogyMethod": "Tên phương pháp sư phạm áp dụng (VD: Lớp học đảo ngược, Trạm học tập, PBL, Gamification)",
  "learningOutcomes": ["Kết quả đầu ra 1", "Kết quả đầu ra 2", "Kết quả đầu ra 3"],
  "quizData": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi trắc nghiệm thực tế?",
      "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
      "correctIndex": 0,
      "explanation": "Giải thích chi tiết vì sao đúng/sai theo kiến thức bài học"
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Khái niệm / Thuật ngữ / Hiện tượng",
      "back": "Định nghĩa, cơ chế và ví dụ thực tế minh họa",
      "hint": "Gợi ý nhớ nhanh"
    }
  ],
  "stations": [
    {
      "id": 1,
      "name": "Trạm 1: Khám phá",
      "durationMinutes": 7,
      "task": "Nhiệm vụ cụ thể học sinh phải hoàn thành",
      "product": "Sản phẩm đầu ra của nhóm"
    }
  ],
  "exitTicketQuestions": [
    "Điều tâm đắc nhất em học được hôm nay là gì?",
    "Một câu hỏi em vẫn còn băn khoăn muốn hỏi thầy/cô?",
    "Ứng dụng kiến thức này vào đời sống thế nào?"
  ],
  "rubricCriteria": [
    {
      "criterion": "Tiêu chí đánh giá",
      "level1": "Chưa đạt",
      "level2": "Đạt",
      "level3": "Khá",
      "level4": "Xuất sắc"
    }
  ],
  "teacherGuide": "Hướng dẫn giáo viên cách tổ chức 5-7 phút cho ứng dụng này trên lớp."
}`;

    const text = await generateGeminiContent(prompt, systemInstruction);
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({ success: true, data: parsed });
    }
    throw new Error('Empty response from model');
  } catch (error: any) {
    console.error('Error generating app:', error?.message);
    // Graceful fallback with rich curriculum data
    const fallbackData = {
      title: `${req.body.topic || 'Hệ Sinh Thái & Đa Dạng Sinh Học'} - Ứng Dụng Tương Tác`,
      description: 'Bộ công cụ tương tác kết hợp trò chơi hóa và đánh giá nhanh giúp học sinh khắc sâu kiến thức trọng tâm.',
      subject: req.body.subject || 'Khoa học Tự nhiên',
      gradeLevel: req.body.gradeLevel || 'Lớp 8',
      type: req.body.appType || 'quiz',
      pedagogyMethod: 'Dạy học tích cực & Đánh giá quá trình (Formative Assessment)',
      learningOutcomes: [
        'Nhận biết và phân tích được các mắt xích trong chuỗi thức ăn',
        'Vận dụng giải thích sự cân bằng của hệ sinh thái trong tự nhiên',
        'Phát triển năng lực làm việc nhóm và giao tiếp khoa học'
      ],
      quizData: [
        {
          id: 1,
          question: 'Sinh vật nào sau đây đóng vai trò là sinh vật sản xuất trong hệ sinh thái trên cạn?',
          options: ['Cây xanh quang hợp', 'Sâu ăn lá', 'Nấm hoại sinh', 'Chim sẻ'],
          correctIndex: 0,
          explanation: 'Cây xanh có chất diệp lục giúp hấp thụ năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ qua quá trình quang hợp.'
        },
        {
          id: 2,
          question: 'Hiện tượng hiệu ứng nhà kính tăng cao chủ yếu do sự tích tụ của loại khí nào?',
          options: ['Khí Oxy (O2)', 'Khí Carbon dioxide (CO2)', 'Khí Nitơ (N2)', 'Khí Heli (He)'],
          correctIndex: 1,
          explanation: 'CO2 cùng với metan là các khí nhà kính chính hấp thụ và phát xạ lại bức xạ hồng ngoại về bề mặt Trái Đất.'
        },
        {
          id: 3,
          question: 'Trong phương pháp dạy học theo dự án (PBL), giai đoạn nào học sinh đóng vai trò trung tâm nhất?',
          options: ['Nghe giáo viên thuyết trình lý thuyết', 'Tự chủ nghiên cứu, chế tạo sản phẩm và giải quyết vấn đề', 'Chép bài ghi trên bảng', 'Làm bài kiểm tra một tiết'],
          correctIndex: 1,
          explanation: 'PBL trao quyền tối đa cho học sinh làm chủ tiến trình tạo ra sản phẩm thực tế.'
        }
      ],
      flashcards: [
        {
          id: 1,
          front: 'Chuỗi thức ăn (Food Chain)',
          back: 'Một dãy gồm nhiều loài sinh vật có quan hệ dinh dưỡng với nhau, mỗi loài là một mắt xích.',
          hint: 'Bắt đầu từ sinh vật sản xuất'
        },
        {
          id: 2,
          front: 'Lớp học đảo ngược (Flipped Classroom)',
          back: 'Học sinh tiếp cận kiến thức mới ở nhà qua video/tài liệu; thời gian trên lớp dành cho thảo luận, thực hành và giải quyết vấn đề nâng cao.',
          hint: 'Chuyển bài giảng về nhà, bài tập lên lớp'
        }
      ],
      stations: [
        {
          id: 1,
          name: 'Trạm 1: Khám phá Hiện tượng',
          durationMinutes: 7,
          task: 'Xem video thí nghiệm mô phỏng và ghi lại 3 phát hiện nổi bật vào sơ đồ tư duy nhóm.',
          product: 'Phiếu học tập KWL'
        },
        {
          id: 2,
          name: 'Trạm 2: Tranh biện & Phản biện',
          durationMinutes: 8,
          task: 'Các nhóm bốc thăm câu hỏi tình huống thực tế và đưa ra 2 giải pháp giảm phát thải tại trường học.',
          product: 'Infographic mini trên giấy A3'
        }
      ],
      exitTicketQuestions: [
        'Một điều bất ngờ nhất em khám phá được qua tiết học?',
        'Nội dung nào em cảm thấy muốn được thầy cô làm rõ thêm?',
        'Em sẽ áp dụng bài học này vào hành động cụ thể nào trong tuần tới?'
      ],
      rubricCriteria: [
        {
          criterion: 'Kỹ năng làm việc nhóm & phân công',
          level1: 'Chưa có sự phối hợp, chỉ 1-2 bạn làm',
          level2: 'Có phân công nhưng chưa đều',
          level3: 'Phối hợp nhịp nhàng, hỗ trợ nhau',
          level4: 'Phân công xuất sắc, phát huy thế mạnh từng thành viên'
        },
        {
          criterion: 'Chất lượng sản phẩm & Báo cáo',
          level1: 'Nội dung sơ sài, thiếu chính xác',
          level2: 'Đủ nội dung cơ bản',
          level3: 'Nội dung chính xác, hình thức sinh động',
          level4: 'Sáng tạo vượt trội, lập luận thuyết phục'
        }
      ],
      teacherGuide: 'Dành 5 phút khởi động bằng Vòng quay gọi tên hoặc Quiz 3 câu, sau đó chuyển sang hoạt động nhóm.'
    };
    return res.json({ success: true, data: fallbackData, isFallback: true });
  }
});

// 2. API: Generate 5512 Innovative Lesson Plan (Kế hoạch bài dạy đổi mới GDPT 2018)
app.post('/api/gemini/generate-lesson-plan', async (req, res) => {
  try {
    const { subject, gradeLevel, lessonTitle, pedagogyMethod, targetOutcomes } = req.body;

    const systemInstruction = `Bạn là chuyên gia tập huấn phương pháp dạy học đổi mới của Bộ Giáo dục và Đào tạo Việt Nam. 
Hãy soạn Kế hoạch bài dạy (Giáo án) đổi mới sáng tạo chuẩn cấu trúc Công văn 5512/BGDĐT, ứng dụng chuyển đổi số và công nghệ mạnh mẽ.
Ngôn ngữ: Tiếng Việt, chuẩn mực sư phạm, chi tiết, khả thi khi triển khai trên lớp thực tế.`;

    const prompt = `Soạn Kế hoạch bài dạy đổi mới cho:
- Môn học: ${subject || 'Toán học'}
- Khối lớp: ${gradeLevel || 'Lớp 10'}
- Tên bài học: ${lessonTitle || 'Ứng dụng đạo hàm khảo sát hàm số'}
- Phương pháp đổi mới: ${pedagogyMethod || 'Dạy học kết hợp công nghệ tương tác & Lớp học đảo ngược'}
- Yêu cầu trọng tâm: ${targetOutcomes || 'Phát triển năng lực giải quyết vấn đề, tư duy mô hình hóa'}

Định dạng JSON trả về:
{
  "lessonTitle": "Tên bài học",
  "subject": "${subject}",
  "gradeLevel": "${gradeLevel}",
  "timeAllocation": "Số tiết (ví dụ: 2 tiết - 90 phút)",
  "pedagogyMethod": "${pedagogyMethod}",
  "objectives": {
    "competencies": ["Năng lực chung (Tự chủ, Giao tiếp hợp tác)", "Năng lực đặc thù môn học"],
    "qualities": ["Chăm chỉ", "Trung thực", "Trách nhiệm"]
  },
  "digitalTools": [
    { "name": "Tên app/công cụ", "role": "Vai trò trong tiết dạy (Khởi động / Khảo sát / Trạm)" }
  ],
  "activities": [
    {
      "phase": "Hoạt động 1: Mở đầu / Khởi động (5-7 phút)",
      "goal": "Mục tiêu hoạt động",
      "content": "Nội dung học sinh thực hiện",
      "product": "Sản phẩm mong đợi",
      "implementation": "Cách thức tổ chức thực hiện của GV và HS (Chuyển giao nhiệm vụ - Thực hiện - Báo cáo - Kết luận)"
    },
    {
      "phase": "Hoạt động 2: Hình thành kiến thức mới (20-25 phút)",
      "goal": "Mục tiêu hoạt động",
      "content": "Nhiệm vụ nghiên cứu tài liệu / Trạm học tập",
      "product": "Sơ đồ tư duy / Phiếu học tập số",
      "implementation": "Tiến trình tổ chức cụ thể"
    },
    {
      "phase": "Hoạt động 3: Luyện tập (10-12 phút)",
      "goal": "Khắc sâu và vận dụng trực tiếp",
      "content": "Bộ câu hỏi tương tác / Mini Quiz số",
      "product": "Kết quả bảng điểm trực tiếp trên màn hình",
      "implementation": "Tiến trình tổ chức cụ thể"
    },
    {
      "phase": "Hoạt động 4: Vận dụng & Mở rộng (5-8 phút)",
      "goal": "Liên hệ thực tiễn đời sống",
      "content": "Thử thách dự án nhỏ / Exit Ticket",
      "product": "Câu trả lời thẻ ra khỏi lớp",
      "implementation": "Giao nhiệm vụ về nhà kết nối số"
    }
  ],
  "differentiation": "Biện pháp phân hóa cho học sinh khá giỏi và học sinh cần hỗ trợ",
  "assessmentRubricSummary": "Tóm tắt cách đánh giá quá trình thông qua app liên kết"
}`;

    const text = await generateGeminiContent(prompt, systemInstruction);
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({ success: true, data: parsed });
    }
    throw new Error('Empty response');
  } catch (error: any) {
    console.error('Error generating lesson plan:', error?.message);
    const fallbackLesson = {
      lessonTitle: req.body.lessonTitle || 'Ứng Dụng Năng Lượng Tái Tạo Trong Đời Sống',
      subject: req.body.subject || 'Khoa học Tự nhiên',
      gradeLevel: req.body.gradeLevel || 'Lớp 8',
      timeAllocation: '2 tiết (90 phút)',
      pedagogyMethod: req.body.pedagogyMethod || 'Dạy học theo Trạm kết hợp Ứng dụng số',
      objectives: {
        competencies: [
          'Năng lực nhận thức khoa học: Nêu được ưu nhược điểm của năng lượng mặt trời và gió',
          'Năng lực tìm hiểu tự nhiên: Thiết kế được mô hình tuabin gió mini hoặc bình nước nóng năng lượng mặt trời',
          'Năng lực giao tiếp và hợp tác: Làm việc nhóm hiệu quả tại các trạm học tập'
        ],
        qualities: [
          'Trách nhiệm: Ý thức tiết kiệm năng lượng và bảo vệ môi trường sống',
          'Chăm chỉ: Tích cực hoàn thành nhiệm vụ khám phá tại trạm'
        ]
      },
      digitalTools: [
        { name: 'Vòng quay may mắn', role: 'Chia nhóm ngẫu nhiên và bốc thăm thứ tự báo cáo' },
        { name: 'Đồng hồ đếm ngược trạm', role: 'Quản lý thời gian di chuyển giữa 4 trạm học tập' },
        { name: 'Đấu trường Quiz tương tác', role: 'Củng cố kiến thức cuối giờ và xếp hạng thi đua' },
        { name: 'Thẻ ra khỏi lớp (Exit Ticket)', role: 'Thu thập phản hồi nhanh về mức độ hiểu bài' }
      ],
      activities: [
        {
          phase: 'Hoạt động 1: Khởi động - Đánh thức tò mò (7 phút)',
          goal: 'Tạo tâm thế hào hứng và kết nối trải nghiệm thực tế về cuộc khủng hoảng năng lượng',
          content: 'Học sinh xem video 90 giây về thành phố mất điện và tham gia Quiz nhanh 3 câu hỏi trên màn hình',
          product: 'Câu trả lời của học sinh trên màn hình tương tác',
          implementation: 'GV chiếu câu hỏi gợi mở -> HS trả lời nhanh -> GV dẫn dắt vào bài mới'
        },
        {
          phase: 'Hoạt động 2: Hình thành kiến thức - Dạy học theo trạm (35 phút)',
          goal: 'Chủ động tìm hiểu các dạng năng lượng sạch qua 4 trạm học tập luân chuyển',
          content: 'Trạm 1: Năng lượng mặt trời; Trạm 2: Năng lượng gió; Trạm 3: Năng lượng sinh khối; Trạm 4: Giải pháp tại gia đình',
          product: 'Sản phẩm poster nhóm và bảng tổng hợp KWL',
          implementation: 'GV bật Đồng hồ trạm (8 phút/trạm) -> Các nhóm luân chuyển theo chiều kim đồng hồ -> GV quan sát, trợ giúp nhóm gặp khó khăn'
        },
        {
          phase: 'Hoạt động 3: Luyện tập - Đấu trường tri thức (15 phút)',
          goal: 'Khắc sâu kiến thức và rèn phản xạ phân tích tình huống',
          content: 'Học sinh thi đấu trả lời 5 câu hỏi tình huống qua Mini-App Quiz',
          product: 'Bảng xếp hạng Top 5 và điểm số tích lũy của các tổ',
          implementation: 'GV điều khiển ứng dụng trên máy chiếu -> HS chọn đáp án và giải thích ngắn gọn lý do chọn'
        },
        {
          phase: 'Hoạt động 4: Vận dụng & Đánh giá - Thẻ ra khỏi lớp (8 phút)',
          goal: 'Đúc kết bài học và định hướng hành động tiết kiệm điện tại nhà',
          content: 'Mỗi học sinh điền 1 giải pháp cụ thể vào Thẻ Exit Ticket điện tử',
          product: 'Đám mây ý tưởng và phản hồi của cả lớp hiển thị trực tiếp',
          implementation: 'GV quét tổng thể phản hồi -> Nhận xét ngắn gọn và giao nhiệm vụ dự án tuần sau'
        }
      ],
      differentiation: 'Nhóm học sinh hoàn thành sớm được giao thử thách tính toán công suất pin mặt trời cho hộ gia đình.',
      assessmentRubricSummary: 'Đánh giá đồng đẳng giữa các nhóm theo thang đo 4 mức độ: Đóng góp ý kiến, Tính chính xác khoa học, Thẩm mỹ sản phẩm.'
    };
    return res.json({ success: true, data: fallbackLesson, isFallback: true });
  }
});

// Setup dev server with Vite or production static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduCraft Innovate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
