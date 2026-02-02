import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ApplicationData } from "@shared/schemas/application";

interface SectionProps {
  register: UseFormRegister<ApplicationData>;
  errors: FieldErrors<ApplicationData>;
}

export const BasicInfoSection: React.FC<SectionProps> = ({
  register,
  errors,
}) => (
  <section>
    <h3 className="text-xl font-semibold mb-3 text-purple-400">Basic Info</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Full Name"
          {...register("basicInfo.fullName")}
          className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.fullName ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
        />
        {errors.basicInfo?.fullName && (
          <span className="text-red-400 text-xs ml-1">
            {errors.basicInfo.fullName.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Email"
          {...register("basicInfo.email")}
          className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.email ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
        />
        {errors.basicInfo?.email && (
          <span className="text-red-400 text-xs ml-1">
            {errors.basicInfo.email.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="School / University"
          {...register("basicInfo.school")}
          className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Graduation Year (e.g. 2026)"
          {...register("basicInfo.year")}
          className={`bg-gray-700 p-3 rounded border ${errors.basicInfo?.year ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
        />
        {errors.basicInfo?.year && (
          <span className="text-red-400 text-xs ml-1">
            {errors.basicInfo.year.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 md:col-span-2">
        <input
          type="text"
          placeholder="Location (City, Country)"
          {...register("basicInfo.location")}
          className="bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
        />
      </div>
    </div>
  </section>
);

export const SkillsLinksSection: React.FC<SectionProps & { setValue: any }> = ({
  register,
  errors,
  setValue,
}) => (
  <section>
    <h3 className="text-xl font-semibold mb-3 text-purple-400">
      Skills & Links
    </h3>
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Skills (comma separated, e.g. React, Node, Python)"
          className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none"
          onChange={(e) => {
            const skills = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            setValue("skillsAndLinks.skills", skills);
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="GitHub URL"
            {...register("skillsAndLinks.githubUrl")}
            className={`bg-gray-700 p-3 rounded border ${errors.skillsAndLinks?.githubUrl ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
          />
          {errors.skillsAndLinks?.githubUrl && (
            <span className="text-red-400 text-xs ml-1">
              {errors.skillsAndLinks.githubUrl.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Portfolio URL"
            {...register("skillsAndLinks.portfolioUrl")}
            className={`bg-gray-700 p-3 rounded border ${errors.skillsAndLinks?.portfolioUrl ? "border-red-500" : "border-gray-600"} focus:border-purple-500 outline-none`}
          />
          {errors.skillsAndLinks?.portfolioUrl && (
            <span className="text-red-400 text-xs ml-1">
              {errors.skillsAndLinks.portfolioUrl.message}
            </span>
          )}
        </div>
      </div>
    </div>
  </section>
);

export const AccessibilitySection: React.FC<SectionProps> = ({ register }) => (
  <section>
    <h3 className="text-xl font-semibold mb-3 text-purple-400">
      Accessibility & Needs
    </h3>
    <div className="space-y-4">
      <textarea
        placeholder="Dietary Restrictions"
        {...register("accessibility.dietaryRestrictions")}
        className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
      />
      <textarea
        placeholder="Accommodations / Allergies / Other needs"
        {...register("accessibility.accommodations")}
        className="w-full bg-gray-700 p-3 rounded border border-gray-600 focus:border-purple-500 outline-none h-20"
      />
    </div>
  </section>
);
