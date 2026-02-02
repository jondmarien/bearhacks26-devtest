import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ApplicationSchema,
  type ApplicationData,
} from "@shared/schemas/application";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/layout/LoadingScreen";

// Wizard Components
import WizardProgress from "@/components/application/wizard/WizardProgress";
import WizardNavigation from "@/components/application/wizard/WizardNavigation";
import StepAboutYou from "@/components/application/wizard/StepAboutYou";
import StepExperience from "@/components/application/wizard/StepExperience";
import StepWork from "@/components/application/wizard/StepWork";
import StepNeeds from "@/components/application/wizard/StepNeeds";
import StepDiversity from "@/components/application/wizard/StepDiversity";
import StepConsent from "@/components/application/wizard/StepConsent";
import StepReview from "@/components/application/wizard/StepReview";

const STEPS = [
  "About You",
  "Hacker Experience",
  "Your Work",
  "Additional Needs",
  "Diversity Check",
  "Consent & Agreement",
  "Review",
];

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ApplicationPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(ApplicationSchema),
    mode: "onChange",
    defaultValues: {
      consent: {
        shareWithSponsors: false,
        mlhCodeOfConduct: false,
        mlhPrivacyPolicy: false,
        mlhEmails: false,
        commute: false,
        accurateInfo: false,
      },
    },
  });

  const formData = watch();

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${API_URL}/api/application/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof response.data === "string") {
          throw new Error("Received HTML instead of JSON. Check API URL.");
        }

        if (response.data) {
          reset(response.data);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [user, reset]);

  const onSubmit = async (data: ApplicationData) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_URL}/api/application`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    // Validate current step fields before proceeding
    if (currentStep === 0) {
      isValid = await trigger("basicInfo");
    } else if (currentStep === 1) {
      isValid = await trigger("hackerExperience");
    } else if (currentStep === 2) {
      isValid = await trigger("work");
    } else if (currentStep === 3) {
      isValid = await trigger("additionalNeeds");
    } else if (currentStep === 4) {
      isValid = await trigger("diversity");
      // Diversity is optional
    } else if (currentStep === 5) {
      isValid = await trigger("consent");
    } else {
      isValid = true;
    }

    if (isValid) {
      if (currentStep === STEPS.length - 1) {
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (authLoading) return <LoadingScreen message="Checking Credentials..." />;
  if (!user) return <Navigate to="/" replace />;
  if (loading) return <LoadingScreen message="Fetching Application..." />;
  if (submitting) return <LoadingScreen message="Submitting Application..." />;

  const CurrentStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <StepAboutYou register={register} errors={errors} />;
      case 1:
        return (
          <StepExperience
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case 2:
        return (
          <StepWork register={register} errors={errors} setValue={setValue} />
        );
      case 3:
        return (
          <StepNeeds
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 4:
        return (
          <StepDiversity
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case 5:
        return <StepConsent register={register} errors={errors} />;
      case 6:
        return <StepReview formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-primary selection:bg-purple-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 font-display tracking-tight">
            Apply to{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-400">
              BearHacks 2026
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Complete the application below to reserve your spot. We can't wait
            to see what you build!
          </p>
        </header>

        {/* Wizard Container */}
        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
          {/* Progress Bar */}
          <WizardProgress currentStep={currentStep} totalSteps={STEPS.length} />

          {/* Step Content with Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === STEPS.length - 1}
            canProceed={true} // Logic handled in handleNext via trigger()
          />
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          &copy; 2026 BearHacks. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ApplicationPage;
