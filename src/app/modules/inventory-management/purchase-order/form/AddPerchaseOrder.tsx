import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'rizzui';
import { getThemeColors } from '../../../../../theme/colors';

interface PurchaseOrderFormProps {
  initialData?: Partial<any>;
  onSubmit: (data: Partial<any>) => void;
  onCancel: () => void;
  isDarkMode?: boolean;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const { control, handleSubmit, watch, setValue, reset } = useForm<Partial<any>>({
    defaultValues: initialData || {
      productName: '',
      uom: '',
      convUnit: 1,
      quantity: 0,
      bonusQty: 0,
      costPrice: 0,
      saleTax: 0,
      totalCost: 0,
      discount: 0,
      netCost: 0,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const quantity = watch('quantity') ?? 0;
  const convUnit = watch('convUnit') ?? 1;
  const costPrice = watch('costPrice') ?? 0;
  const saleTax = watch('saleTax') ?? 0;
  const discount = watch('discount') ?? 0;

  React.useEffect(() => {
    const total = (Number(quantity) * Number(convUnit) * Number(costPrice)) + Number(saleTax);
    const net = total - Number(discount);
    setValue('totalCost', Number.isFinite(total) ? Number(total.toFixed(2)) : 0);
    setValue('netCost', Number.isFinite(net) ? Number(net.toFixed(2)) : 0);
  }, [quantity, convUnit, costPrice, saleTax, discount, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-5">
        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Product Name</label>
          <Controller
            name="productName"
            control={control}
            rules={{ required: 'Product name is required' }}
            render={({ field, fieldState }) => (
              <>
                <input
                  {...field}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${theme.input.background} ${theme.text.primary} ${fieldState.error
                    ? theme.status.error.border
                    : `${theme.border.input} focus:border-orange-500`
                    }`}
                />
                {fieldState.error && (
                  <p className={`text-sm mt-1 ${theme.status.error.text}`}>{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>UOM</label>
          <Controller
            name="uom"
            control={control}
            render={({ field }) => (
              <input {...field} placeholder="e.g. kg, liters" className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Conv Unit</label>
          <Controller
            name="convUnit"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Quantity</label>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Bonus Qty</label>
          <Controller
            name="bonusQty"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Cost Price</label>
          <Controller
            name="costPrice"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Sale Tax</label>
          <Controller
            name="saleTax"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Total Cost</label>
          <Controller
            name="totalCost"
            control={control}
            render={({ field }) => (
              <input {...field} readOnly className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Discount</label>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <input {...field} type="number" min={0} step="0.01" className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${theme.input.background} ${theme.border.input} ${theme.text.primary}`} />
            )}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>Net Cost</label>
          <Controller
            name="netCost"
            control={control}
            render={({ field }) => (
              <input {...field} readOnly className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none ${theme.text.primary}`} />
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className={`border h-10 rounded-lg ${theme.button.secondary}`}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className={`h-10 rounded-lg ${theme.button.primary}`}
        >
          {initialData ? 'Update Purchase Order' : 'Add Purchase Order'}
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;

