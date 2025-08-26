import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

const ProductsAndServicesTab = () => {
  const { t } = useTranslation();

  const items = [
    { id: '1', name: 'Product 1', price: '$19.99', description: 'This is a great product.', tags: ['new', 'sale'] },
    { id: '2', name: 'Service 1', price: '$49.99/mo', description: 'This is a great service.', tags: ['monthly'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.productsAndServices.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.productsAndServices.description')}</p>
      </div>

      <div className="flex justify-end">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t('agents.edit.productsAndServices.addItem')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.productsAndServices.columns.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.productsAndServices.columns.price')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.productsAndServices.columns.description')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.productsAndServices.columns.tags')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.productsAndServices.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{item.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{item.price}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{item.description}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-5 w-5 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsAndServicesTab;
