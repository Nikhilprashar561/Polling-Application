import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

let questionIdCounter = 1;
let optionIdCounter = 1;

function generateQuestionId() {
  return questionIdCounter++;
}

function generateOptionId() {
  return optionIdCounter++;
}

/* Fade-in-up on mount */
function AnimateIn({ children, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = `opacity 0.22s ease ${delay}ms, transform 0.22s ease ${delay}ms`;

    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}

function QuestionCard({ question, onUpdate, onRemove }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      questionText: question.text || "",
      isRequired: question.required || false,
      options: {
        option1: question.options[0]?.text || "",
        option2: question.options[1]?.text || "",
        option3: question.options[2]?.text || "",
        option4: question.options[3]?.text || "",
      },
    },
    mode: "all",
  });

  const onSubmit = (data) => {
    console.log("Submitted Data => ", data);
  };

  const handleQuestionTextChange = (e) =>
    onUpdate({ ...question, text: e.target.value });

  const handleRequiredChange = (e) =>
    onUpdate({ ...question, required: e.target.checked });

  const handleOptionTextChange = (optionId, value) =>
    onUpdate({
      ...question,
      options: question.options.map((opt) =>
        opt.id === optionId ? { ...opt, text: value } : opt,
      ),
    });

  const handleAddOption = () => {
    if (question.options.length >= 4) return;

    onUpdate({
      ...question,
      options: [...question.options, { id: generateOptionId(), text: "" }],
    });
  };

  const handleRemoveOption = (optionId) =>
    onUpdate({
      ...question,
      options: question.options.filter((opt) => opt.id !== optionId),
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 rounded-xl px-7 pt-6 pb-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-bold tracking-widest text-black uppercase">
          Question {question.index}
        </span>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={question.required}
              {...register("isRequired")}
              onChange={handleRequiredChange}
              className="w-3.5 h-3.5 cursor-pointer accent-gray-500 rounded"
            />

            <span className="text-[13px] text-gray-400 group-hover:text-gray-600 transition-colors duration-150">
              Required
            </span>
          </label>

          <button
            type="button"
            onClick={onRemove}
            className="text-[13px] text-gray-400 hover:text-red-400 transition-colors duration-150 cursor-pointer bg-transparent border-0 p-0"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Question Input */}
      <input
        type="text"
        value={question.text}
        {...register("questionText", {
          required: "Question is required",
          minLength: {
            value: 10,
            message: "At least 10 character need",
          },
        })}
        onChange={handleQuestionTextChange}
        placeholder="Enter your question..."
        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-150"
      />

      <span className="text-xs leading-relaxed mb-5 text-gray-500">
        {errors.questionText && (
          <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
            {errors.questionText.message}
          </span>
        )}
      </span>

      {/* Options Label */}
      <div className="text-[11px] font-bold tracking-widest text-gray-300 uppercase mb-3">
        Options
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2.5 mb-3">
        {question.options.map((option, i) => (
          <AnimateIn key={option.id} delay={i * 30}>
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border-[1.5px] border-gray-300 shrink-0 bg-white" />

              <input
                type="text"
                value={option.text}
                {...register(`options.option${i + 1}`, {
                  required: "Option is required",
                })}
                onChange={(e) =>
                  handleOptionTextChange(option.id, e.target.value)
                }
                placeholder="Option text..."
                className="flex-1 px-3.5 py-2 text-sm border border-gray-200 rounded-lg outline-none text-gray-800 placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-150"
              />

              <span className="text-xs leading-relaxed mb-2 text-gray-500">
                {errors.options?.[`option${i + 1}`] && (
                  <span className="text-red-500 text-xs mt-1 block">
                    {errors.options?.[`option${i + 1}`]?.message}
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                title="Remove option"
                className="text-gray-300 hover:text-red-400 text-lg leading-none px-1 cursor-pointer transition-colors duration-150 bg-transparent border-0"
              >
                ×
              </button>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Add Option / Max note */}
      {question.options.length < 4 ? (
        <button
          type="button"
          onClick={handleAddOption}
          className="flex items-center gap-1.5 text-[13px] text-gray-300 hover:text-gray-500 cursor-pointer transition-colors duration-150 mt-1 bg-transparent border-0 p-0"
        >
          <span className="text-base leading-none">⊕</span>
          <span>Add option</span>
        </button>
      ) : (
        <p className="text-[12px] text-gray-500 italic mt-2">
          Maximum 4 options reached
        </p>
      )}

      <div className="flex mt-4 cursor-pointer items-center gap-3">
        <button
          type="submit"
          className="btn-primary cursor-pointer flex-1 rounded-xl bg-black py-3.5 text-sm font-semibold text-white"
        >
          Add Question
        </button>
      </div>
    </form>
  );
}

export default function FormBuilder() {
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: generateQuestionId(),
        index: prev.length + 1,
        text: "",
        required: false,
        options: [],
      },
    ]);
  };

  const handleUpdateQuestion = (updated) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q)),
    );

  const handleRemoveQuestion = (id) =>
    setQuestions((prev) =>
      prev
        .filter((q) => q.id !== id)
        .map((q, i) => ({
          ...q,
          index: i + 1,
        })),
    );

  return (
    <div className="mb-5 rounded-2xl px-4 py-8 font-sans">
      <div className="max-w-[860px] mx-auto flex flex-col gap-4">
        {/* Empty State */}
        {questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[15px] text-gray-400 font-medium mb-1">
              No questions added yet.
            </p>

            <p className="text-[13px] text-gray-300">
              Click the button below to add your first question.
            </p>
          </div>
        )}

        {/* Question Cards */}
        {questions.map((question) => (
          <AnimateIn key={question.id}>
            <QuestionCard
              question={question}
              onUpdate={handleUpdateQuestion}
              onRemove={() => handleRemoveQuestion(question.id)}
            />
          </AnimateIn>
        ))}

        {/* Add Question Button */}
        <button
          onClick={handleAddQuestion}
          className="w-full py-4 bg-white border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-300 font-medium tracking-wide cursor-pointer hover:border-gray-400 hover:text-gray-500 transition-all duration-200 active:scale-[0.99]"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
}
