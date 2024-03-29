migration-show:
	yarn migration:show
migration-create:
	echo \# make migrate name="$(name)"
	yarn migration:create src/infra/typeorm/migration/$(name)
migration-down:
	yarn migration:down
migration-up:
	yarn migration:up