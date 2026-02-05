# django-check

Static **N+1 query detection** for Django, directly in VS Code.

This extension runs a bundled static analyzer to detect common N+1 query patterns **before runtime**. It analyzes Django ORM usage and reports missing `select_related` / `prefetch_related` calls as editor diagnostics.

No runtime hooks. No configuration. No external dependencies.

---

## What it does

* Detects N+1 query patterns statically
* Shows diagnostics while you edit
* Zero runtime overhead
* No code instrumentation
* Works alongside Pyright and other Python LSPs

---

## What it detects

Related-field access inside QuerySet iteration without prefetching:

* ForeignKey
* OneToOne
* ManyToMany
* Reverse relations
* Model inheritance

---

## Example

```python
users = User.objects.all()

for user in users:
    user.profile.bio  # N+1
```

Diagnostic:

```
[N+1] user.profile
Potential N+1 query: accessing `user.profile` inside loop
```

Fix:

```python
users = User.objects.select_related("profile")

for user in users:
    user.profile.bio
```

The diagnostic is cleared once the relation is prefetched.

---

## Installation

Install the extension from the VS Code Marketplace.

The analyzer binary is **bundled with the extension**.
Nothing to install. Nothing to configure.

---

## Usage

Open a Django project in VS Code.

The language server starts automatically when a project root is detected via:

* `manage.py`
* `pyproject.toml`
* `.git`

Diagnostics appear as you edit Python files.

---

## Limitations

This project is under active development.

Current limitations include:

* Limited interprocedural analysis
* Partial support for `Prefetch` objects
* Limited understanding of:

  * `annotate`
  * `aggregate`
  * complex custom managers
* Incomplete handling of implicit chained prefetches, e.g.:

```python
prefetch_related("chat__users__profile")
```

Expect false positives and false negatives.

---

## Reference

Analyzer and language server source:

[https://github.com/richardhapb/django-check](https://github.com/richardhapb/django-check)

(The extension bundles the binary; the link is for reference only.)

---

## License

MIT

