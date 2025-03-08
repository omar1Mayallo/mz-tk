import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories, Category, Subcategory, Property } from "../data";
import { formSchema, FormData } from "../validation";
import Select from "react-select";

const CategoryForm: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [propertyChain, setPropertyChain] = useState<Property[]>([]);
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainCategory: 0,
      subcategory: 0,
      properties: {},
    },
  });

  const mainCategoryValue = watch("mainCategory");
  const subcategoryValue = watch("subcategory");

  // Handle Main Category Change
  useEffect(() => {
    const category = categories.find((cat) => cat.id === mainCategoryValue);
    setSelectedCategory(category || null);
    setSelectedSubcategory(null);
    setPropertyChain([]);
    setValue("subcategory", 0);
    setValue("properties", {});
  }, [mainCategoryValue, setValue]);

  // Handle Subcategory Change
  useEffect(() => {
    const subcategory = selectedCategory?.children.find(
      (sub) => sub.id === subcategoryValue
    );
    setSelectedSubcategory(subcategory || null);
    setPropertyChain(subcategory?.properties || []);
    setValue("properties", {});
  }, [subcategoryValue, selectedCategory, setValue]);

  // Handle Form Submission
  const onSubmit = (data: FormData) => {
    const result: Record<string, string> = {
      "Main Category":
        categories.find((cat) => cat.id === data.mainCategory)?.name || "",
      Subcategory:
        selectedCategory?.children.find((sub) => sub.id === data.subcategory)
          ?.name || "",
    };

    Object.entries(data.properties).forEach(
      ([propId, { selectedOption, customValue }]) => {
        const prop = propertyChain.find((p) => p.id === Number(propId));
        result[prop?.name || ""] =
          selectedOption === "Other" ? customValue || "" : selectedOption;
      }
    );

    setSubmittedData(result);
  };

  // Handle Form Reset
  const handleReset = () => {
    reset({
      mainCategory: 0,
      subcategory: 0,
      properties: {},
    });
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setPropertyChain([]);
    setSubmittedData(null);
  };

  // Render Property Dropdowns
  const renderPropertyDropdowns = () => {
    return propertyChain.map((property) => {
      const options = property.options.map((opt) => ({
        value: opt.name,
        label: opt.name,
      }));
      const propKey = property.id.toString();

      return (
        <div key={property.id} className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            {property.name}
          </label>
          <Controller
            name={`properties.${propKey}`}
            control={control}
            render={({ field }) => (
              <>
                <Select
                  options={options}
                  value={
                    options.find(
                      (opt) => opt.value === field.value?.selectedOption
                    ) || null
                  }
                  onChange={(selected) => {
                    const value = selected?.value || "";
                    field.onChange({ selectedOption: value, customValue: "" });
                  }}
                  className="w-full text-gray-700"
                  placeholder={`Select ${property.name}`}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: errors.properties?.[propKey]
                        ? "#ef4444"
                        : "#d1d5db",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#3b82f6" },
                    }),
                  }}
                />
                {field.value?.selectedOption === "Other" && (
                  <input
                    type="text"
                    value={field.value?.customValue || ""}
                    onChange={(e) =>
                      field.onChange({
                        selectedOption: "Other",
                        customValue: e.target.value,
                      })
                    }
                    placeholder="Enter custom value"
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}
              </>
            )}
          />
          {errors.properties?.[propKey]?.selectedOption && (
            <p className="text-red-500 text-xs mt-1">
              {errors.properties[propKey]?.selectedOption?.message}
            </p>
          )}
        </div>
      );
    });
  };

  // Render Submitted Data Table and JSON View
  const renderTableAndJson = () => {
    if (!submittedData) {
      return <p className="text-gray-500 italic">No data submitted yet.</p>;
    }

    return (
      <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
        {/* Table */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Submitted Data
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
                    Key
                  </th>
                  <th className="border-b border-gray-300 p-3 text-left text-sm font-semibold text-gray-700">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(submittedData).map(([key, value], index) => (
                  <tr
                    key={key}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="border-b border-gray-200 p-3 text-sm text-gray-700">
                      {key}
                    </td>
                    <td className="border-b border-gray-200 p-3 text-sm text-gray-700">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON View */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            JSON View
          </h3>
          <pre className="bg-gray-900 text-white p-4 rounded-md text-sm overflow-x-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex flex-col justify-center items-center">
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md min-w-[300px] md:min-w-[400px]">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
            Category Selection
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Main Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Main Category
              </label>
              <Controller
                name="mainCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    options={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                    value={
                      categories
                        .map((cat) => ({ value: cat.id, label: cat.name }))
                        .find((opt) => opt.value === field.value) || null
                    }
                    onChange={(selected) =>
                      field.onChange(selected?.value || 0)
                    }
                    className="w-full text-gray-700"
                    placeholder="Select Main Category"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: errors.mainCategory
                          ? "#ef4444"
                          : "#d1d5db",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#3b82f6" },
                      }),
                    }}
                  />
                )}
              />
              {errors.mainCategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mainCategory.message}
                </p>
              )}
            </div>

            {/* Subcategory */}
            {selectedCategory && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Subcategory
                </label>
                <Controller
                  name="subcategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={selectedCategory.children.map((sub) => ({
                        value: sub.id,
                        label: sub.name,
                      }))}
                      value={
                        selectedCategory.children
                          .map((sub) => ({ value: sub.id, label: sub.name }))
                          .find((opt) => opt.value === field.value) || null
                      }
                      onChange={(selected) =>
                        field.onChange(selected?.value || 0)
                      }
                      className="w-full text-gray-700"
                      placeholder="Select Subcategory"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors.subcategory
                            ? "#ef4444"
                            : "#d1d5db",
                          boxShadow: "none",
                          "&:hover": { borderColor: "#3b82f6" },
                        }),
                      }}
                    />
                  )}
                />
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message}
                  </p>
                )}
              </div>
            )}

            {/* Properties */}
            {propertyChain.length > 0 && renderPropertyDropdowns()}

            {/* Submit and Reset Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-300 text-gray-800 py-2.5 rounded-md hover:bg-gray-400 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Table and JSON Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-w-[300px] md:min-w-[400px]">
          {renderTableAndJson()}
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
