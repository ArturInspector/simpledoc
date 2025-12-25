<script lang="ts">
  import { currentDocument, templates } from '$lib/stores/app';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import type { TemplateVariable } from '$lib/types';
  
  let formData = $state<Record<string, any>>({});
  
  $effect(() => {
    if ($currentDocument) {
      formData = { ...$currentDocument.data };
    } else {
      formData = {};
    }
  });
  
  let currentTemplate = $derived($templates.find(t => t.id === $currentDocument?.templateId));
  let variables = $derived(currentTemplate?.variables || []);
  
  function updateField(key: string, value: any) {
    formData[key] = value;
    // Можно добавить автосохранение
  }
  
  function saveDocument() {
    if ($currentDocument) {
      currentDocument.update(doc => ({
        ...doc!,
        data: formData,
        updatedAt: new Date(),
      }));
    }
  }
</script>

<div class="max-w-4xl mx-auto space-y-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold text-gray-900">
      {#if $currentDocument}
        {$currentDocument.title}
      {:else}
        Новый документ
      {/if}
    </h1>
    <Button variant="primary" onclick={saveDocument}>
      💾 Сохранить
    </Button>
  </div>
  
  {#if currentTemplate}
    <div class="panel-office p-4 mb-4">
      <h2 class="text-sm font-semibold text-gray-700 mb-2">Шаблон: {currentTemplate.name}</h2>
      {#if currentTemplate.description}
        <p class="text-sm text-gray-600">{currentTemplate.description}</p>
      {/if}
    </div>
  {/if}
  
  <div class="space-y-4">
    {#if variables.length > 0}
      {#each variables as variable}
        <div class="panel-office p-4">
          {#if variable.type === 'text' || variable.type === 'textarea'}
            <Input
              label={variable.label}
              placeholder={variable.defaultValue || `Введите ${variable.label.toLowerCase()}`}
              value={formData[variable.key] || variable.defaultValue || ''}
              oninput={(e) => updateField(variable.key, e.target.value)}
            />
          {:else if variable.type === 'number'}
            <Input
              label={variable.label}
              type="number"
              value={String(formData[variable.key] || variable.defaultValue || '')}
              oninput={(e) => updateField(variable.key, Number(e.target.value))}
            />
          {:else if variable.type === 'date'}
            <Input
              label={variable.label}
              type="date"
              value={formData[variable.key] || variable.defaultValue || ''}
              oninput={(e) => updateField(variable.key, e.target.value)}
            />
          {:else if variable.type === 'list'}
            {@const selectId = `select-${variable.key}`}
            <div class="flex flex-col gap-1">
              <label for={selectId} class="text-sm font-medium text-gray-700">{variable.label}</label>
              <select
                id={selectId}
                class="input-office"
                value={formData[variable.key] || variable.defaultValue || ''}
                onchange={(e) => updateField(variable.key, e.target.value)}
              >
                <option value="">Выберите...</option>
                {#each variable.options || [] as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>
      {/each}
    {:else}
      <div class="panel-office p-8 text-center text-gray-500">
        <p>Выберите шаблон или создайте новый документ</p>
      </div>
    {/if}
  </div>
</div>

