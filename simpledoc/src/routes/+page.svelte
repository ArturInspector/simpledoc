<script lang="ts">
  import DocumentEditor from '$lib/components/features/DocumentEditor.svelte';
  import { currentDocument, documents } from '$lib/stores/app';
  
  // Инициализация с тестовыми данными для демонстрации
  $effect(() => {
    if ($documents.length === 0) {
      documents.set([
        {
          id: '1',
          title: 'Коммерческое предложение #1',
          templateId: 'template-1',
          data: {
            company_name: 'ООО Рога и Копыта',
            client_name: 'Иван Иванов',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      currentDocument.set($documents[0]);
    }
  });
</script>

<DocumentEditor />
